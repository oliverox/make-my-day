import { createAI } from "ai/rsc";
import { getRecommendation } from './getRecommendation';
import { getItinerary } from './getItinerary';
import { updateItinerary } from './updateItinerary';

export type ServerMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  display: string;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  actions: {
    getItinerary,
    updateItinerary,
    getRecommendation
  },
  initialAIState: [],
  initialUIState: [],
});
