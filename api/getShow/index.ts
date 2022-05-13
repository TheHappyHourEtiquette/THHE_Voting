import { AppAuthentication, createOAuthAppAuth } from "@octokit/auth-oauth-app";
import * as GreyMatter from "gray-matter";
import { Octokit } from "@octokit/rest";

import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const getShow: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  
  console.log('Show docs found: ' + context.bindings.showDocuments.length);
  if (context.bindings.showDocuments.length != 1) {
    throw '0 or more than 1 show docs found';
  }
  
  var show = context.bindings.showDocuments[0];  
  
  const data = {
        Title: "Scottish Summit 2022",
        Host: {
            Title: "Kevin McDonnell",
            ImageUrl: "https://github.com/TheHappyHourEtiquette/THHE-Shows/raw/main/PanellistImages/KevinMcDonnell.jpg",
            TotalScore: 0
          },
        Panellists: [{
            Title: "Al Eardley",
            ImageUrl: "https://github.com/TheHappyHourEtiquette/THHE-Shows/raw/main/PanellistImages/Al%20Eardley.jpg",
            TotalScore: 0
          },{
            Title: "Sara Fennah",
            ImageUrl: "https://github.com/TheHappyHourEtiquette/THHE-Shows/raw/main/PanellistImages/SaraFennah.jpg",
            TotalScore: 0
          }],
        Questions: [],
        DefendTheIndefensibles: []
      };

    context.res = {
        headers: {
            'Content-Type': 'text/html'
        },
        body: show
    }
    context.done()

};

export default getShow;
