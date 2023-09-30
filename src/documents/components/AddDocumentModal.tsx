import React, { ChangeEventHandler, FC, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text
} from "@chakra-ui/react";
import { Document } from "../../types";
import api from "../../auth/apiService";
import { Pink } from "../../styles/colors";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (document: Document) => void;
}

export const AddDocumentModal: FC<AddDocumentModalProps> = ({ isOpen, onClose, onDocumentAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentType, setDocumentType] = useState<string>("COMPANY_10K_FILING");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [ticker, setTicker] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [quarter, setQuarter] = useState<string>("Q1");
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSaveClicked = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    createDocument()
  };

  const createDocument = async () => {
    if (!documentUrl) {
      setErrorMessage('Please enter a URL.');
      return;
    }

    if (!ticker) {
      setErrorMessage("Please enter a ticker.");
      return;
    }

    if (!year) {
      setErrorMessage("Please enter a year.");
      return;
    }

    if (documentType === "COMPANY_10Q_FILING" && !quarter) {
      setErrorMessage("Please enter a quarter.");
      return;
    }

    // Clear the error message
    setErrorMessage('');

    setIsLoading(true)
    await api.post(`/documents/`, {
      ticker: ticker,
      document_url: documentUrl,
      document_type: documentType,
      document_year: year,
      document_quarter: documentType === "COMPANY_10Q_FILING" ? quarter : null,
    }).then((response) => {
      setIsLoading(false);
      const document = response.data;
      onDocumentAdded(document);
      onClose();
    }).catch((error) => {
      setIsLoading(false);
      setErrorMessage(`Error adding document: ${error}`);
    });
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add a document</ModalHeader>
        <ModalCloseButton/>
        <ModalBody marginTop={4}>
          <Box marginBottom={2}>
            <Text fontSize="14px">Type</Text>
          </Box>
          <Box marginBottom={4}>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              iconColor="white"
            >
              <option value="COMPANY_10K_FILING">Annual Report (10-K)</option>
              <option value="COMPANY_10Q_FILING">Quarterly Report (10-Q)</option>
            </Select>
          </Box>
          <Box marginBottom={2}>
            <Text fontSize="14px">URL</Text>
          </Box>
          <Box marginBottom={4}>
            <Input
              placeholder="https://www.sec.gov/Archives/edgar/data/..."
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
            />
          </Box>
          {documentType === "COMPANY_10K_FILING" && (
            <AnnualReportRow
              ticker={ticker}
              year={year}
              onTickerChange={(e) => setTicker(e.target.value)}
              onYearChange={(e) => setYear(e.target.value)}
            />
          )}
          {documentType === "COMPANY_10Q_FILING" && (
            <QuarterlyReportRow
              ticker={ticker}
              year={year}
              quarter={quarter}
              onTickerChange={(e) => setTicker(e.target.value)}
              onYearChange={(e) => setYear(e.target.value)}
              onQuarterChange={(e) => setQuarter(e.target.value)}
            />
          )}
          {errorMessage && (
            <Box marginTop={4}>
              <Text color={Pink}>{errorMessage}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isLoading} onClick={onSaveClicked}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface AnnualReportRowProps {
  ticker: string;
  year: string;
  onTickerChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onYearChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

const AnnualReportRow: FC<AnnualReportRowProps> = ({ ticker, year, onTickerChange, onYearChange }) => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Ticker</Text>
        </Box>
        <Input
          placeholder="AAPL"
          value={ticker}
          onChange={onTickerChange}
        />
      </Box>
      <Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Year</Text>
        </Box>
        <Input
          placeholder="2022"
          value={year}
          onChange={onYearChange}
        />
      </Box>
    </SimpleGrid>
  )
}

interface QuarterlyReportRowProps {
  ticker: string;
  year: string;
  quarter: string;
  onTickerChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onYearChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onQuarterChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
}

const QuarterlyReportRow: FC<QuarterlyReportRowProps> = ({
  ticker,
  quarter,
  year,
  onTickerChange,
  onYearChange,
  onQuarterChange,
}) => {
  return (
    <SimpleGrid columns={3} spacing={4}>
      <Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Ticker</Text>
        </Box>
        <Input
          placeholder="AAPL"
          value={ticker}
          onChange={onTickerChange}
        />
      </Box>
      <Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Quarter</Text>
        </Box>
        <Select
          value={quarter}
          onChange={onQuarterChange}
          iconColor="white"
        >
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </Select>
      </Box>
      <Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Year</Text>
        </Box>
        <Input
          placeholder="2022"
          value={year}
          onChange={onYearChange}
        />
      </Box>
    </SimpleGrid>
  )
}
