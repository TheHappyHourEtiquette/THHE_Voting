import { Panellist } from "./Panellist";
import { DefendTheIndefensible } from "./DefendTheIndefensible";
import { Question } from "./Question";

export interface Show {
    Title: string;
    Host: Panellist;
    Panellists: Panellist[];
    Questions: Question[];
    DefendTheIndefensibles: DefendTheIndefensible[];
}
