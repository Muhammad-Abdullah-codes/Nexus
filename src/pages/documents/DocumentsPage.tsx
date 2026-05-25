import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Upload,
  FileSignature,
  Save,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export const DocumentsPage: React.FC = () => {
  const sigPad = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signature, setSignature] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<"Draft" | "In Review" | "Signed">(
    "Draft",
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setDocStatus("In Review");
    }
  };

  const clearSignature = () => sigPad.current?.clear();

  const saveSignature = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      setSignature(sigPad.current.toDataURL());
      setDocStatus("Signed");
    }
  };

  const handleFinalize = () => {
    if (!signature) return;
    alert("Document successfully signed, archived, and generated!");

    // Simulate downloading the signed document
    const link = document.createElement("a");
    link.href = signature;
    link.download = `signed-${fileName || "contract"}.png`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Document Chamber
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Contracts, agreements, and secure e-signatures
          </p>
        </div>

        <div className="flex items-center gap-2">
          {docStatus === "Draft" && (
            <Clock size={18} className="text-yellow-500" />
          )}
          {docStatus === "In Review" && (
            <FileText size={18} className="text-blue-500" />
          )}
          {docStatus === "Signed" && (
            <CheckCircle size={18} className="text-green-500" />
          )}
          <Badge
            variant={
              docStatus === "Signed"
                ? "success"
                : docStatus === "Draft"
                  ? "warning"
                  : "primary"
            }
            size="lg"
          >
            {docStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <h2 className="font-medium text-gray-900 dark:text-white">
              Document Preview
            </h2>
          </CardHeader>
          <CardBody>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
            />

            {previewUrl ? (
              <div className="space-y-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {fileName}
                </div>
                <iframe
                  src={previewUrl}
                  className="w-full h-80 rounded-lg border border-gray-200 dark:border-gray-700"
                  title="PDF Preview"
                />
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace Document
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 transition-colors cursor-pointer dark:hover:border-blue-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} className="mb-4" />
                <p className="text-lg">Click to Upload PDF Contract</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex justify-between items-center">
            <h2 className="font-medium text-gray-900 dark:text-white">
              E-Signature Pad
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearSignature}>
                Clear
              </Button>
              <Button variant="primary" size="sm" onClick={saveSignature}>
                <FileSignature size={16} className="mr-2" /> Validate
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 h-64 shadow-inner">
              <SignatureCanvas
                ref={sigPad}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 250,
                  className: "sigCanvas w-full h-full",
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {signature && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 border-green-500/30">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Validated Signature:
              </p>
              <img
                src={signature}
                alt="Signature"
                className="h-16 mt-2 border-b-2 border-gray-400 dark:border-gray-600"
              />
            </div>
            <Button leftIcon={<Save />} onClick={handleFinalize}>
              Finalize & Archive
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
