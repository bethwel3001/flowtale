"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { startStory } from "@/lib/actions";
import { useStory } from "@/lib/story-context";
import { Loader2, PenSquare } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }).max(200, {
    message: "Topic must not exceed 200 characters.",
  }),
  genre: z.string().min(3, {
    message: "Genre must be at least 3 characters.",
  }).max(50, {
    message: "Genre must not exceed 50 characters."
  }),
});

export default function CreateStoryPage() {
  const router = useRouter();
  const { addStory } = useStory();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      genre: "Fantasy",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const newStoryData = await startStory(values.topic, values.genre);
      const storyId = crypto.randomUUID();
      const newStory = { ...newStoryData, id: storyId };

      addStory(newStory);

      toast({
        title: "Story Created!",
        description: "Your new adventure awaits.",
      });

      router.push(`/story/${storyId}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem creating your story. Please try again.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl">
              Create a New Narrative
            </CardTitle>
            <CardDescription>
              Provide a topic and genre to kickstart your AI-powered story. What adventure will you begin?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Topic</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A lone astronaut discovers a mysterious signal from an uncharted planet."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />

                      </FormControl>
                      <FormDescription>
                        This is the starting prompt for your story.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sci-Fi, Fantasy, Mystery" {...field} />
                      </FormControl>
                      <FormDescription>
                        The genre helps the AI set the tone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-4">
                  <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conjuring...
                      </>
                    ) : (
                      <>
                        <PenSquare className="mr-2 h-4 w-4" />
                        Begin Adventure
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
