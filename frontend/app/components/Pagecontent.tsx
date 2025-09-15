type PageContentProps = {
  title?: string;
  children?: React.ReactNode;
};

export default function PageContent({ title = 'Content', children }: PageContentProps) {
  return (
    <main className="flex-grow-1">
      <div className="container py-4">
        <h3 className="m-0 mb-3">{title}</h3>
        {children}
      </div>
    </main>
  );
}
