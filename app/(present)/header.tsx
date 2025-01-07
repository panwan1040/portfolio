
import Image from "next/image";

const Header = () => {
    return ( 
        <div>
            <header className="h-20 w-full border-b-2 border-slate-200 px-4 ">
                <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full ">
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image
                            src="/carrot.png" height={40} width={40} alt="carrot"
                        />
                        <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                            Pycarrot
                        </h1>
                    </div>
                   
                </div>
            </header>
        </div>
     );
}
 
export default Header;