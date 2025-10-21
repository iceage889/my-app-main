type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <div className="my-20 mt-40">
      <h1 className="text-2xl lg:text-3xl font-bold text-center py-5 text-red-500">
        {title}
      </h1>
    </div>
  );
}
