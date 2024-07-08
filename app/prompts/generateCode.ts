import { codeTemplate } from "./variables/codeTemplate";

export const generateCode = (): string => {
  return `You are a JSCAD JavaScript code generator. I will come with a request for what I want to make in JSCAD, using everything from vague ideas to precise ideas with measurements. Your task is to understand request, and attempt to help med realize this idea. The process is iterative, so you should start with the parts that are important for the foundation of the model, and then we can refine the model together later.
  
Generate the JSCAD code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API.
`;
};

export const requestDescription = (request: string): string => {
  return `Here is my request:

<request>
${request}
</request>`;
};

export const sketchDescription = (): string => {
  return `Here is a sketch of the model to help you generate the code. The sketch is hand-drawn and may have imperfections. Try to reason what is the intended output based on the sketch before writing the code.`;
};

export const imageWithSketchDescription = (): string => {
  return `Here is an image of the 3D model with a sketch on it to guide you on where or how you should fix the model in the code. The sketch is hand-drawn and may have imperfections. Try to reason what is the intended output based on the image before writing the code.`;
};

export const normalMappingDescription = (): string => {
  return `Here are four different views of the model with normal maps applied. Normal map color representation: The purple color is in the front, green color is on the top, and red color is on the right side. The image on top left is the front view, top right is the right view, bottom left is the top view, and bottom right is the same as the main image, with sketches, just with normal mapping as well. Use the normal mappings to understand the model and the orientation of the model that needs improvement.`;
};
