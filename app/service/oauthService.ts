import { Injectable } from '@angular/core';

@Injectable()
export class OAuthService {
    public loginUrl: string;
    public clientID: string;
    public scope: string;
    public responseType: string;
    public redirectUrl: string;
    public oauthUrl: string;
    public tokenStore: Storage;

    constructor() {
        this.loginUrl = "https://login.live.com/oauth20_authorize.srf";
        this.redirectUrl = "http://localhost";
        //this.clientID = "000000004811DB42";
        this.clientID = "1a342a7e-b5cf-450e-9188-4a8970e4af9e";
        //this.scope = "service::https://intkds.dns-cargo.com::MBI_SSL";
        this.scope = "https://outlook.office.com/mail.read https://outlook.office.com/mail.send";
        this.responseType = "token";
        this.tokenStore = window.sessionStorage;
    }

    private generateLoginUrl(): string {
        var url = this.loginUrl
            + "?client_id="
            + this.clientID
            + "&scope="
            + this.scope
            + "&response_type="
            + this.responseType
            + "&redirect_uri="
            + this.redirectUrl;

        this.oauthUrl = url;
        return url;
    }

    public login() {
        return new Promise((resolve, reject) => {
            var browserRef = window.open(this.generateLoginUrl(), "_blank", "location=no,clearsessioncache=yes,clearcache=yes,closebuttoncaption=Done");
            browserRef.addEventListener("loadstart", (event) => {
                if ((event.url).indexOf(this.redirectUrl) === 0) {
                    browserRef.removeEventListener("exit", (event) => { });
                    browserRef.close();
                    var parsedResponse = this.parseImplicitResponse(((event.url).split("#")[1]).split("&"));

                    if (parsedResponse) {
                        resolve(parsedResponse);
                    } else {
                        reject("Having problem authenticating");
                    }
                }
            });

            browserRef.addEventListener("exit", function (event) {
                reject("The sign in flow was canceled");
            });
        });
    }

    public logoff() {
        //TODO
    }

    public oauthCallback(url) {
        // Parse the OAuth data received from Facebook
        var queryString,
            obj;

        // if (url.indexOf("access_token=") > 0) {
        queryString = url.substr(url.indexOf('#') + 1);
        obj = this.parseQueryString(queryString);
        //this.tokenStore.getItem("fbAccessToken) = obj['access_token'];
        //     if (loginCallback) loginCallback({ status: 'connected', authResponse: { accessToken: obj['access_token'] } });
        // } else if (url.indexOf("error=") > 0) {
        //     queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
        //     obj = this.parseQueryString(queryString);
        //     if (loginCallback) loginCallback({ status: 'not_authorized', error: obj.error });
        // } else {
        //     if (loginCallback) loginCallback({ status: 'not_authorized' });
        // }
    }

    private parseQueryString(queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');

        params.forEach(function (param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });

        return obj;
    }


    private parseImplicitResponse(responseParameters: Array<String>): Object {
        var parameterMap = {};
        for (var i = 0; i < responseParameters.length; i++) {
            parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        }
        if (parameterMap["access_token"] !== undefined && parameterMap["access_token"] !== null) {
            return parameterMap;
        } else {
            return null;
        }
    }
}