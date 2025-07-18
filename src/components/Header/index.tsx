import Image from "next/image";

export interface IHeaderProps {
  handleNewTransaction: () => void;
}

export function Header({ handleNewTransaction }: IHeaderProps) {
  return (
    <header className="bg-header w-full h-[212px]" >
        <div className="max-w-[1120px] mx-auto flex row justify-between pt-8">
            <Image src="/logo.png" width={172} height={40} alt="Logo Image" />
            <button className="bg-button text-white px-8 py-3 rounded-md hover:opacity-80" onClick={handleNewTransaction}> Nova transação </button> 
        </div>
    </header>
  );
}