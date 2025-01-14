"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

import Editor from "@monaco-editor/react";

const Section2 = () => {
  const [code, setCode] = useState(""); // เริ่มต้นเป็นค่าว่าง
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // โหลดไฟล์ port.txt เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    const loadCodeFromFile = async () => {
      try {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const fileName = isMobile ? "/port-m.txt" : "/port.txt"; // ใช้ไฟล์ที่เหมาะสม
        const response = await fetch(fileName);
        if (!response.ok) {
          throw new Error("Failed to fetch the file");
        }
        const fileContent = await response.text();
        setCode(fileContent); // อัปเดตโค้ดใน state
      } catch (error) {
        console.error("Error loading file:", error);
        setCode("// Failed to load code from port.txt");
      }
    };

    loadCodeFromFile();
  }, []);

  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/pages/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput("Error: Failed to compile and run code");
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="font-bold text-gray-800">MY RESUME</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ตัวแก้ไขโค้ด */}
        <div className="rounded-lg border bg-gray-50">
          <Editor
            className=""
            height="40vh"
            defaultLanguage="cpp"
            value={code} // โค้ดที่ดึงมาจากไฟล์
            theme="light"
            onChange={(value, event) => setCode(value ?? "")}
          />
        </div>

        {/* ปุ่ม Run */}
        <div className="flex justify-end">
          <Button
            variant={"secondary"}
            onClick={runCode}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Play size={16} />
            {isLoading ? "Running..." : "Run Code"}
          </Button>
        </div>

        {/* แสดง Output */}
        <div className="rounded-lg border border-gray-700 bg-black text-white p-4 font-mono">
          <div className="text-lg font-semibold mb-2">Output:</div>
          <pre className="mt-2 text-sm overflow-x-auto">
            {output ? (
              <div className="whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="text-gray-400">
                Output will be displayed here.
              </div>
            )}
          </pre>
        </div>
      </CardContent>

      {output ? (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg mb-4 font-bold text-gray-800">
            You can also check out another C++ project of mine that I started
            back in 2019 when I first began programming. It's a simple
            electronic calculator, and you can download the demo (exe file) for
            Windows{" "}
            <a
              href="https://github.com/panwan1040/cpp_miniproject_electronic_cal"
              className=" font-bold text-gray-600 hover:underline hover:text-gray-800 "
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          {/* <p className="text-sm text-gray-500">
          Feel free to explore the code on my GitHub as well:
          <a
            href="https://github.com/panwan1040/cpp_miniproject_electronic_cal"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cpp_miniproject_electronic_cal
          </a>
        </p> */}
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default Section2;
