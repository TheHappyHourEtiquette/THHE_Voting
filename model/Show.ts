import { Panellist } from "./Panellist";
import { DefendTheIndefensible } from "./DefendTheIndefensible";
import { Question } from "./Question";

export interface Show {
    Title: string;
    id: string;
    session: string;
    SelectedQuestionId: number;
    SelectedPanellistId: number;
    SelectedDFIId: number;
    CurrentScreen: string;
    Host: Panellist;
    Panellists: Panellist[];
    Questions: Question[];
    DefendTheIndefensibles: DefendTheIndefensible[];
}
