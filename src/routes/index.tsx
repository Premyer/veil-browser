import { createFileRoute } from "@tanstack/react-router";
import BrowserWorkspace from '@/components/browser-workspace';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Veil — Dein persönlicher Browser-Raum' },
    { name: 'description', content: 'Dein Web-Raum mit Tabs, Lesezeichen, Notizen, Verlauf und privaten Tabs. Lokal, auf deinem Gerät.' },
    { property: 'og:title', content: 'Veil — Das Internet gehört dir.' },
    { property: 'og:description', content: 'Entdecken, sammeln und Gedanken festhalten. Dein persönlicher Browser-Raum.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: BrowserWorkspace,
});
