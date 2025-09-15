type SiteFooterProps = {
    title?: string;
  };
  
  export default function SiteFooter({ title = 'Footer' }: SiteFooterProps) {
    return (
      <footer className="bg-light border-top">
        <div className="container py-3">
          <h4 className="m-0">{title}</h4>
        </div>
      </footer>
    );
  }
  