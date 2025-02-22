/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import DownloadIcon from "@mui/icons-material/Download";

export default function preprocessMarkdown(text: any) {
  if (!text || typeof text !== "string") {
    return null;
  }
  const lines = text.split("\n");
  return lines.map((line: any, index: any) => (
    <React.Fragment key={index}>
      {line.trim() === "" ? (
        <br />
      ) : (
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            ol: ({ node, ...props }) => (
              <ol className="list-decimal ml-6 pl-4" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc ml-6 pl-4" {...props} />
            ),
            li: ({ node, children }) => (
              <li className="mb-1 mt-1">{children}</li>
            ),
            a: ({ node, href, children }) => {
              if (
                href?.startsWith("https://aka.undiksha.ac.id/api/ktm/generate")
              ) {
                const [isDownloading, setIsDownloading] = useState(false);
                const [hasError, setHasError] = useState(false);

                const handleDownload = async () => {
                  setIsDownloading(true);
                  try {
                    const nextJsImageUrl = `${
                      window.location.origin
                    }/_next/image?url=${encodeURIComponent(href)}&w=640&q=100`;

                    const response = await fetch(nextJsImageUrl);
                    if (!response.ok) {
                      throw new Error("Gagal mengambil gambar");
                    }

                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "KTM.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Gagal mendownload gambar:", error);
                    alert("Terjadi kesalahan saat mendownload gambar");
                  } finally {
                    setIsDownloading(false);
                  }
                };

                return (
                  <>
                    <button
                      onClick={handleDownload}
                      className="bg-blue-500 text-white p-1 px-2 rounded-md hover:bg-blue-600 transition-all ease-in-out mr-3"
                    >
                      <DownloadIcon fontSize="small" />
                    </button>

                    {isDownloading && <Spinner size="sm" />}

                    <div className="relative my-2">
                      {!hasError ? (
                        <Image
                          className="rounded-lg"
                          priority={true}
                          width={440}
                          height={202}
                          quality={100}
                          placeholder="empty"
                          src={href}
                          alt="Preview KTM"
                          onError={() => setHasError(true)}
                        />
                      ) : (
                        <div className="text-red-500 text-center py-4">
                          Maaf, NIM tidak valid atau gambar tidak dapat dimuat.
                        </div>
                      )}
                      <div
                        className="absolute inset-0"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          background: "transparent",
                          cursor: "not-allowed",
                        }}
                      ></div>
                    </div>
                  </>
                );
              }
              return (
                <a
                  href={href}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {line}
        </ReactMarkdown>
      )}
    </React.Fragment>
  ));
}
