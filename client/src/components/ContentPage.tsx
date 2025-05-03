const ContentPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto py-10 px-4">{children}</div>
    </div>
  );
};

export default ContentPage;
