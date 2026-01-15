
"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStory } from '@/lib/story-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, Share2, Sparkles, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StorySummaryPage() {
  const router = useRouter();
  const params = useParams();
  const { getStory } = useStory();
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isClient, setIsClient] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const story = useMemo(() => isClient ? getStory(storyId) : undefined, [isClient, getStory, storyId]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClient && (!story || !story.isComplete)) {
      router.replace(`/story/${storyId}`);
    }
  }, [isClient, story, storyId, router]);

  const handleDownload = async () => {
    if (!summaryRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(summaryRef.current, { 
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${story?.finalTitle || 'story'}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShare = () => {
    const text = `I just created an amazing story called "${story?.finalTitle}" on FlowTale+! Check out this awesome AI storytelling app.`;
    const url = `https://github.com/bethwel3001/flowtale`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  if (!isClient || !story) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading summary...
      </div>
    );
  }

  const storyHistory = (() => {
    const path = [];
    let currentNode = story.nodes[story.rootNodeId];
    const visited = new Set();
    while (currentNode) {
        path.push(currentNode);
        visited.add(currentNode.id);
        const children = Object.values(story.nodes).filter(n => n.parentId === currentNode.id);
        const nextNode = children.find(c => !visited.has(c.id)); // A simple way to traverse, might not be the user's exact path but gives a full story.
        currentNode = nextNode;
    }
    return path;
  })();

  return (
    <div className="container py-8 md:py-12">
       <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
        <div className="flex gap-2">
           <Button onClick={handleShare} variant="outline" size="sm">
              <Twitter className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading} size="sm">
              {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Download PDF
            </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div ref={summaryRef} className="bg-card p-8 md:p-12 rounded-xl shadow-2xl border">
          <CardHeader className="text-center p-0 mb-8">
            <motion.h1 
              className="font-headline text-4xl md:text-6xl text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {story.finalTitle}
            </motion.h1>
            <CardDescription className="mt-2 text-lg">A {story.genre} tale.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="prose prose-lg dark:prose-invert max-w-none font-body text-base/relaxed md:text-lg/relaxed">
              {storyHistory.map((node, index) => (
                <div key={node.id} className="mb-4">
                  {node.choice && <p className="italic text-muted-foreground">&gt; {node.choice}</p>}
                  <p>{node.storyPart}</p>
                </div>
              ))}
              <div className="mt-12 text-center">
                 <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                 <h3 className="font-headline text-2xl md:text-3xl mb-2">The Conclusion</h3>
                 <p className="italic">{story.conclusion}</p>
              </div>
            </div>
          </CardContent>

           <CardFooter className="flex-col items-center mt-12 pt-8 border-t">
              <p className="font-headline text-2xl">FlowTale+</p>
              <p className="text-sm text-muted-foreground">An AI-powered interactive storytelling adventure.</p>
           </CardFooter>
        </div>
      </motion.div>
    </div>
  );
}
