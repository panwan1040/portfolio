import Link from "next/link";
import { Button } from "@/components/ui/button";

const Section1 = () => {
  return (
    <section className="relative bg-white py-16 ">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800  ">
            Panwan Meansiri
          </h1>
          {/* <p className="text-lg text-gray-600 mt-4 font-bold">
            "Why did the server laugh?"
            <br />
            <span className="text-gray-500 font-bold">"Because it got a request!"</span>
          </p> */}

          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          <div className="flex flex-col mt-6 gap-4 text-left">
            <div className="flex gap-3 items-center">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <p className="text-gray-700 font-bold">"Man, I stole your code."</p>
            </div>
            <div className="flex gap-3 items-center justify-end">
              <p className="text-gray-700 font-bold">"It's not my code."</p>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button asChild variant={"super"}>
              <Link target="_blank" href="https://github.com/panwan1040">GitHub</Link>
            </Button>

            <Button asChild variant={"ghost"}>
              <Link href="/projects">View Projects</Link>
            </Button>
           
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 rounded-full  flex items-center justify-center">
              <img
                src="/pf.png"
                alt="Profile"
                className="p-10 rounded-full shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
