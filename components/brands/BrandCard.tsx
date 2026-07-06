import Image from "next/image";

type Props = {
  name: string;
  logo: string;
};

export default function BrandCard({
  name,
  logo,
}: Props) {
  return (
    <button className="glass flex flex-col items-center rounded-[28px] p-5 transition hover:scale-105">
      <Image
        src={logo}
        alt={name}
        width={60}
        height={60}
        className="object-contain"
      />

      <p className="mt-4 text-sm font-semibold">
        {name}
      </p>
    </button>
  );
}