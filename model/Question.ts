import { PanellistScore } from "./PanellistScore";

export interface Question {
    QuestionText: string;
    QuestionOrder: number;
    Scores: PanellistScore[];
}
