// ==UserScript==
// @name         Episoft Enhanced
// @namespace    Episoft-Enhanced
// @version      0.1
// @description  Adds functionality to enhance the end user experience
// @match        https://www.episoft.com.au/epiCommunities/*
// @icon         https://episofthealth.com/wp-content/uploads/2019/10/e_only_favicon.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js#sha384=vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK
// @run-at       document-end
// @noframes
// @updateURL    https://github.com/BoKu/Episoft-Enhanced/raw/main/Episoft%20Enhanced.user.js
// @downloadURL  https://github.com/BoKu/Episoft-Enhanced/raw/main/Episoft%20Enhanced.user.js
// @supportURL   https://github.com/BoKu/Episoft-Enhanced/issues
// ==/UserScript==
$.noConflict();
jQuery( document ).ready(function( $ ) {
    'use strict';
    var CurrentPage = window.location.pathname;
    var PAID, PID, CVID;
    if(CurrentPage == "/epiCommunities/CareZone/Appointments/AppointmentManagement.aspx"){
        let ctl00_cpContent_rgPatientAppointmentList_ctl00 = $("#ctl00_cpContent_rgPatientAppointmentList_ctl00");
        $($(ctl00_cpContent_rgPatientAppointmentList_ctl00[0]).children("tbody")[0]).children("tr").each(function( index ){
            //Edit Patient
            try{
                PAID = $(this).children("td:nth-child(3)")[0].innerText.trim();
                PID = $(this).children("td:nth-child(4)")[0].innerText.trim();
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
                CVID = $($($(this).children("td:nth-child(2)")[0]).children("a")[1]).attr("href").split(",")[1].trim();
                let NoteButton = $("<span>", {
                    "id": "cvid_"+CVID,
                    "style": "color:#A020F0;font-weight: bold;font-size:14px;font-family:Verdana;cursor:pointer;margin-left:10px;",
                    "title": "Add Patient Notes",
                    "data-cvid": CVID
                }).append("N");
                NoteButton.on("click", function (event){
                    event.preventDefault();
                    window.open ("https://www.episoft.com.au/epiCommunities/CareZone/VisitForms/VisitNotesStandalone.aspx?cvid="+CVID+"&dvid="+CVID, "_self");
                });
                $(this).children("td:nth-child(2)").append(NoteButton);
            }catch(err){console.log(err)}
        });
    }
    else if(CurrentPage == "/epiCommunities/CareZone/VisitForms/VisitNotesStandalone.aspx"){
        $("#btnClose, #btnClose2").on("click", function(event){
            event.preventDefault();
            window.history.back();
        });
    }
    try{console.log("{PID:", PID, ", PAID:", PAID, ", CVID:", CVID, "}"); }catch(err){console.log(err)}
});
