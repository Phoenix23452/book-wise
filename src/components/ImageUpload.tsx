import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const {
  env: {
    apiEndpoint,
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${apiEndpoint}/api/imagekit`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Request failed with status code ${response.status}:  ${error}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

export default function ImageUpload({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) {
  const ikUploadRef = useRef(null);

  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "Image uploaded Successfully",
      description: `${res.filePath} uploaded successfully`,
    });
  };
  const onError = (error: any) => {
    console.log(error);

    toast({
      title: "Image upload Failed",
      description: `Your Image could not be uploaded ! Please try again`,
      variant: "destructive",
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        fileName="test-upload.png"
        onSuccess={onSuccess}
        onError={onError}
      />
      <button
        className="upload-btn "
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          className="object-contain"
          src={"/icons/upload.svg"}
          alt="upload icon"
          width={20}
          height={20}
        />

        <p className="text-base text-light-100">Upload a File</p>

        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={500}
        />
      )}
    </ImageKitProvider>
  );
}
