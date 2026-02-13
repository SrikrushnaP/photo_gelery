import { DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '../config/aws.js';

export const detectLabels = async (imageBuffer) => {
  const command = new DetectLabelsCommand({
    Image: { Bytes: imageBuffer },
    MaxLabels: 10,
    MinConfidence: 70,
  });

  const response = await rekognitionClient.send(command);
  return response.Labels.map(label => ({
    name: label.Name,
    confidence: label.Confidence,
  }));
};
