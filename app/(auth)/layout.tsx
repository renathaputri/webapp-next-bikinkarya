export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 bg-background">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
}
