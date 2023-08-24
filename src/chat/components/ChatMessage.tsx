// Message.tsx

import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { BackgroundColor } from "../../styles/colors";

type MessageProps = {
  sender: string;
  content: string;
  isUser: boolean;
};

const Container = styled.div<{ isUser: boolean }>`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%; // Make the container full width
  border-top: 0.5px solid #3f3f3f; // Add a thin gray line to the bottom
  background: ${({ isUser }) => isUser ? BackgroundColor : BackgroundColor};
`;

const Bubble = styled.div`
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  width: 75%; // Set a fixed width for the bubble
  display: flex; // Make it a flex container
  align-items: baseline; // Align items to the text baseline
  font-family: 'Inter', sans-serif; // Set the font to Inter
  font-size: 14px;
`;

const Content = styled.div`
  margin-left: 14px;
  line-height: 1.5;
  font-size: 14px;
  color: white;
  white-space: pre-wrap; // Or use 'pre-line'
`;

const Sender = styled.div<{ isUser: boolean }>`
  font-weight: 700; // Make the sender name bold
  font-family: 'Inter', sans-serif; // Set the font to Inter
  font-size: 14px;
  min-width: 100px;
  color: ${({ isUser }) => isUser ? '#C4C4C4' : '#C4C4C4'};
`;

const InlineCode = styled.code`
  background: #87837826;
  border-radius: 3px;
  font-family: monospace;
  padding: 2px 4px;
  color: #E63B5D;
`;

export const ChatMessage: React.FC<MessageProps> = ({ sender, content, isUser }) => {
  // Separate the message into lines
  const lines = content.toString().split("<NEWLINE_TOKEN>");

  // Do not add code syntax highlighting to User messages
  if (isUser) {
    return (
      <Container isUser={isUser}>
        <Bubble>
          <Sender isUser={isUser}>{capitalizeFirstLetter(sender)}</Sender>
          <Content>
            {lines.map((line, index) => (
              line === '' ? <br key={index}/> : <div key={index}>{line}</div>
            ))}
          </Content>
        </Bubble>
      </Container>
    );
  }

  // Variables to keep track of code blocks
  let isCode = false;
  let code = '';
  let language = '';
  let codeBlockDelimiter = '';

  // Reduce the lines into an array of elements
  const messageContent = lines.reduce<React.ReactNode[]>((result, line, index) => {
    if (isCode && (line.trim().endsWith('```') || (line.trim().endsWith('``') && codeBlockDelimiter !== '```'))) { // Detect the end of a code block
      if (line.trim().endsWith(codeBlockDelimiter)) { // Check if it's the matching end tag
        // If we're in a code block, add this line to the code block
        code = code ? code + '\n' + line.substring(0, line.lastIndexOf(codeBlockDelimiter)) : line.substring(0, line.lastIndexOf(codeBlockDelimiter));

        // If we were in a code block, render it
        result.push(
          <SyntaxHighlighter language={language} style={nightOwl} key={index}>
            {code}
          </SyntaxHighlighter>
        );

        // Reset the variables for the next code block
        isCode = false;
        code = '';
        language = '';
        codeBlockDelimiter = ''; // Clear the delimiter
      }
    } else if (!isCode && (line.trim().startsWith('```') || line.trim().startsWith('``'))) { // Detect the start of a code block
      // If we weren't in a code block, start one
      isCode = true;
      language = line.trim().substring(3); // Extract the language from the line
      codeBlockDelimiter = line.trim().startsWith('```') ? '```' : '``'; // Save the delimiter
    } else if (isCode) {
      // If we're in a code block, add this line to the code block
      code = code ? code + '\n' + line : line;
    } else {
      // If we're not in a code block, check for inline code
      const inlineCodeRegex = /`(.*?)`/g;
      const parts = line.split(inlineCodeRegex);
      const lineWithCodeHighlight = parts.map((part, i) => {
        if (i % 2 === 1) { // The inline code is at the odd indices
          return <InlineCode key={i}>{part}</InlineCode>;
        } else {
          return part;
        }
      });

      // Render the line
      result.push(line === '' ? <br key={index}/> : <div key={index}>{lineWithCodeHighlight}</div>);
    }

    return result;
  }, []);

  // If the last line was part of a code block, render it
  if (isCode) {
    messageContent.push(
      <SyntaxHighlighter language={language} style={nightOwl} key={'last'}>
        {code}
      </SyntaxHighlighter>
    );
  }

  return (
    <Container isUser={isUser}>
      <Bubble>
        <Sender isUser={isUser}>{capitalizeFirstLetter(sender)}</Sender>
        <Content>
          {messageContent}
        </Content>
      </Bubble>
    </Container>
  );
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
