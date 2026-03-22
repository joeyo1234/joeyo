export const metadata = {
  title: 'Cognitive Systems Architecture | joeyo',
  description: 'Interactive map of the brain as a distributed computing system — modules, pathways, and information flow.',
};

export default function BrainPage() {
  return (
    <iframe
      src="/brain-architecture.html"
      className="w-full h-screen border-0"
      title="Cognitive Systems Architecture"
    />
  );
}
