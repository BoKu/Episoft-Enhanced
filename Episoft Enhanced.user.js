// ==UserScript==
// @name         Episoft Enhanced
// @namespace    Episoft-Enhanced
// @homepage     https://github.com/BoKu/Episoft-Enhanced
// @version      2
// @description  Adds functionality to enhance the end user experience
// @match        https://www.episoft.com.au/epiCommunities/*
// @icon         https://episofthealth.com/wp-content/uploads/2019/10/e_only_favicon.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js#sha384=vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK
// @run-at       document-end
// @noframes
// @supportURL   https://github.com/BoKu/Episoft-Enhanced/issues
// @downloadURL  https://github.com/BoKu/Episoft-Enhanced/raw/main/Episoft%20Enhanced.user.js
// ==/UserScript==
function SetCookie(cname, cvalue, exdays){
    if(exdays != 0){
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }
}
function GetCookie(cname){
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$.noConflict();
jQuery( document ).ready(function( $ ) {
    'use strict';
    var CurrentPage = window.location.pathname;
    //PatientHome.aspx
    if(CurrentPage == "/epiCommunities/CareZone/PatientHome.aspx"){
        try{
            $("tr").each(function(index){
                if($(this).hasClass("DocRow")){
                    let RowID = $(this).attr("id");
                    let FileID = RowID.split("_")[1];
                    let TypeID = RowID.split("_")[0];
                    let FileType = $(this).children("td:nth-child(4)").text();
                    if($.inArray(FileType, ["Photograph, Clinical"]) >= 0){
                        console.log(RowID, FileID, TypeID, FileType);
                        $("#" + RowID).on("mouseenter", function(){
                            let WindowWidth = window.innerWidth / 2
                            let WindowHeight = window.innerHeight / 2
                            let NewImage = $("<img>", {
                                "id": "ee_FloatingImage",
                                "style": "left:" + (WindowWidth) + "px; top:" + (WindowHeight - 250) + "px; position:fixed; z-index:9001; border:1px solid grey; max-width:500px; max-height:500px;",
                                "src": "https://www.episoft.com.au/epiCommunities/CareZone/Document/ViewDocument.aspx?id=" + FileID + "&type=" + TypeID
                            });
                            NewImage.appendTo("body");
                        });
                        $("#" + RowID).on("mouseleave", function(){
                            $("#ee_FloatingImage").remove();
                        });
                    }
                }
            });
        }catch(err){console.log(err)}
    }
    //VisitNotesStandalone.aspx
    if(CurrentPage == "/epiCommunities/CareZone/VisitForms/VisitNotesStandalone.aspx"){
        // Fix the Close button
        try{
            $("#btnClose, #btnClose2").on("click", function(event){
            event.preventDefault();
            window.open("https://www.episoft.com.au/epiCommunities/CareZone/Appointments/AppointmentManagement.aspx", "_self");
        });
        }catch(err){console.log(err)}
        //Fix the Save and Close button
        try{
            $("#btnSaveAndClose, #btnSaveAndClose2").on("click", function(event){
                event.preventDefault();
                SetCookie("WindowCanClose", "true", 0);
                $("#btnSave").click();
            });
            //Check to see if the current window can close, deletes the cookie and navigates back.
            let WindowCanClose = GetCookie("WindowCanClose");
            if(WindowCanClose == "true"){
                SetCookie("WindowCanClose", "true", -1);
                $("#btnClose").click();
            }
        }catch(err){console.log(err)}
    }
    //AppointmentManagement.aspx
    if(CurrentPage == "/epiCommunities/CareZone/Appointments/AppointmentManagement.aspx"){
        let ctl00_cpContent_rgPatientAppointmentList_ctl00 = $("#ctl00_cpContent_rgPatientAppointmentList_ctl00");
        $($(ctl00_cpContent_rgPatientAppointmentList_ctl00[0]).children("tbody")[0]).children("tr").each(function( index ){
            //Edit Patient
            try{
                let PAID = $(this).children("td:nth-child(3)")[0].innerText.trim();
                let PID = $(this).children("td:nth-child(4)")[0].innerText.trim();
                let EditButton = $("<span>", {
                    "id": "pid_"+PID,
                    "style": "color:#8cc436;font-weight: bold;font-size:14px;font-family:Verdana;cursor:pointer;margin-left:10px;",
                    "title": "Edit Patient",
                    "data-pid": PID
                }).append("E");
                EditButton.on("click", function (event){
                    event.preventDefault();
                    window.open("https://www.episoft.com.au/epiCommunities/CareZone/PatientDemographics.aspx?pid="+PID, "_self");
                })
                $(this).children("td:nth-child(2)").append(EditButton);
            }catch(err){console.log(err)}
            //Add Patient Notes
            try{
                let CVID = $($($(this).children("td:nth-child(2)")[0]).children("a")[1]).attr("href").split(",")[1].trim();
                let NoteButton = $("<span>", {
                    "id": "cvid_"+CVID,
                    "style": "color:#A020F0;font-weight: bold;font-size:14px;font-family:Verdana;cursor:pointer;margin-left:10px;",
                    "title": "Add Patient Notes",
                    "data-cvid": CVID
                }).append("N");
                NoteButton.on("click", function (event){
                    event.preventDefault();
                    window.open("https://www.episoft.com.au/epiCommunities/CareZone/VisitForms/VisitNotesStandalone.aspx?cvid="+CVID+"&dvid="+CVID, "_self");
                });
                $(this).children("td:nth-child(2)").append(NoteButton);
            }catch(err){console.log(err)}
        });
        //Relocate footer menu - it can cause issues on certain browsers, and it's not coded to work very well anyway.
        try{
            //Help button
            let HelpURL = $("a#hlHelpBottom").attr("href");
            let HelpLink = $('<li class="rpItem"><a class="rpLink rpRootLink" href="'+HelpURL+'"><span class="rpText">Help</span></a></li>');
            HelpLink.on("mouseover", function(){
                $(this).children("a").addClass("rpHovered");
            });
            HelpLink.on("mouseout", function(){
                $(this).children("a").removeClass("rpHovered");
            });
            $("div#ctl00_pbMenu > ul").append(HelpLink);
            //Contact Us button
            let ContactUsLink = $('<li class="rpItem"><a class="rpLink rpRootLink" href="http://www.episoft.com.au/contact-us.html" target="_blank"><span class="rpText">Contact Us</span></a></li>');
            ContactUsLink.on("mouseover", function(){
                $(this).children("a").addClass("rpHovered");
            });
            ContactUsLink.on("mouseout", function(){
                $(this).children("a").removeClass("rpHovered");
            });
            $("div#ctl00_pbMenu > ul").append(ContactUsLink);
            //Remove the existing menu
            $("div#footer-menu").remove();
        }catch(err){console.log(err)}
    }
});
