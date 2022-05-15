import { PanellistScore } from "./PanellistScore";

export interface Question {
    QuestionId: number;
    QuestionText: string;
    QuestionOrder: number;
    Scores: PanellistScore[];
}
