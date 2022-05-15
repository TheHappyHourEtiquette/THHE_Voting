import { Panellist } from "./Panellist";
import { DefendTheIndefensible } from "./DefendTheIndefensible";
import { Question } from "./Question";

export interface Show {
    Title: string;
    id: string;
    session: string;
    SelectedQuestion: string;
    SelectedPanellist: Panellist;
    SelectedDFI: string;
    CurrentScreen: string;
    Host: Panellist;
    Panellists: Panellist[];
    Questions: Question[];
    DefendTheIndefensibles: DefendTheIndefensible[];
}
