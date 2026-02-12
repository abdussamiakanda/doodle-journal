interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display text-2xl text-garden-cream/50 animate-pulse">
        {message}
      </p>
    </div>
  );
}
