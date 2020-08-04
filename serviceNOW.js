// ==UserScript==
// @name         ServiceNowScript
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  To get ticket resolution from STA
// @author       Yatin
// @include      https://service.service-now.com/*
// @exclude      http*://*google.*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://service.service-now.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle

// ==/UserScript==

let assGrp = '';
let priority = '';
let res1 = '';
let res2 = '';
let res3 = '';
let res4 = 'None of the above';
let color = 'black';
let agl='';

const incidentNumber = document.getElementById('incident.number');
const description = document.getElementById('incident.description');
const short_description = document.getElementById('incident.short_description');

const url = 'http://superadmin.com';
const assGrpDiv= document.getElementById('sys_display.incident.assignment_group');
const resolutionDiv= document.getElementById('incident.close_notes');

const $ = window.jQuery;

(function () {
  'use strict';

   GM.xmlHttpRequest({
        method: 'GET',
        url: 'http://superadmin',
        headers: {
        'Authorization':'Deployer'
        },
        onload: function (assGrpListRes) {
          if (assGrpListRes.status === 200) {
            console.log("assGrp List : "+ this.response);
            agl = JSON.parse(this.response);
            color='red';
          }
        }
   })

  const incident = {};
  incident.IncidentNumber = incidentNumber.value;

  if(description.value!=='')
  {
      incident.Notes = description.value;
  }
  else if(short_description.value!=='')
  {
      incident.Notes = short_description.value;
  }
  else
  {
      incident.Notes = '';
  }

  console.log("*******************incident*************************", incident);

//   const input = { 'vectors': 'tfidf', 'classifier': 'LinearSVC', 'file_upload': 'false', 'unseen_test_data':  [incident] , 'predictor_variable': 'Notes', 'output_variable': 'bit_keywords_list', 'username': 'Gurjot', 'userrole': 'DataScientist' };

  GM.xmlHttpRequest({
    method: 'POST',
    url: url,
    data: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "soprasteria",
    },
    onload: function (response) {

      console.log("Prediction response : "+ this.response);

      if (response.status === 200) {

        const res = JSON.parse(this.response);

        if(res.data[0].Prediction_Outcome_Resolution.length > 0){

         let noOfRes = res.data[0].Prediction_Outcome_Resolution.length;
         if(noOfRes>0)
         {
             res1 = res.data[0].Prediction_Outcome_Resolution[0][0];
             if(noOfRes>1)
             {
                  res2 = res.data[0].Prediction_Outcome_Resolution[1][0];
             }
             if(noOfRes>2)
             {
                  res3 = res.data[0].Prediction_Outcome_Resolution[2][0];
             }
         }

        if(res.data[0].Prediction_Outcome !== ''){

            assGrp = res.data[0].Prediction_Outcome;
        }

        if (res.data[0].Prediction_Outcome_Priority !== '') {

            priority = res.data[0].Prediction_Outcome_Priority;
        }

        if(agl!=='' && agl.data.valid_assigned_group.length!==0)
        {
            agl.data.valid_assigned_group.forEach(agv=>{
              if(assGrp.toString().toLowerCase()===agv.toString().toLowerCase()){
              color="green";
              }
            })
        }

        if(incident.Notes!==''){

        $('body').append('                                                                                                       \
          <div id="gmPopupContainer">                                                                                             \
          <form>                                                                                                                   \
          <h3 style="text-align:center;"><b> STA PREDICTIONS</b></h3> <br>                                                          \
          <div id="assignedGrpPart">                                                                                                 \
          <h5><b> ASSIGNED GROUP : </b></h5> <br>                                                                                     \
          <input type="checkbox" class="sel" id= "Assigned" name ="val3" value="'+assGrp+'"> &nbsp;                                    \
          <label style="color:'+color+';">'+assGrp+'</label><br><br>                                                                    \
          </div>                                                                                                                         \
          <div id="priorityPart">                                                                                                         \
          <h5><b> PRIORITY : </b>                                                                                                          \
          <input type="checkbox" class="sel" id= "priority" name ="val2" value="'+ priority + '"> ' + priority + ' <br><br>               \
          </div>                                                                                                                           \                                                                                                                      \
          <div id= "resolutionPart">                                                                                                        \
          <h5 id="headingRes"><b> RESOLUTIONS : </b></h5><br>                                                                                \
          <input type="radio" class="sel" id="res1" name="val" value="'+ res1 + '" >'+ res1+ '<br><br>                                        \
          <input type="radio" class="sel" id="res2" name="val" value="'+ res2 + '">' + res2 + '<br><br>                                        \
          <input type="radio" class="sel" id="res3" name="val" value="'+ res3 + '">' + res3 + '<br><br>                                         \
          <input type="radio" class="sel" id="res4" name="val" value="" >'+ res4 + '<br><br><br>                                                 \
           </div>                                                                                                                                 \
          <button class="btn btn-secondary float-left" id="gmCloseDlgBtn" type="button">Cancel</button>                                            \
          <button class="btn btn-secondary float-left" id="gmAddNumsBtn" type="button" action="javascript:onsubmit()" disabled>submit</button>      \
          </form>                                                                                                                                    \
          </div>                                                                                                                                      \
        ');

        }

        if(assGrp==='')
        {
            var a= document.getElementById("assignedGrpPart");
            a.style.display = "none";
        }

        if(priority==='')
        {
            var b= document.getElementById("priorityPart");
            b.style.display = "none";
        }

        if(res1==='')
        {
            var c= document.getElementById("resolutionPart");
            c.style.display = "none";
        }

        if(res1 !== '' && res2 === '')
        {
            var d= document.getElementById("res2");
            d.style.display = "none";
            var e= document.getElementById("res3");
            e.style.display = "none";

        }

        if (res1 !== '' && res2 !== '' && res3 === '')
        {
            var f= document.getElementById("res3");
            f.style.display = "none";
        }


        let f1 = 0;

        let f2 = 0;

        let f3 = 0;

        $('#Assigned').change(function () {
          if (this.checked) { f1 = 1; }
          else { f1 = 0; }

          if ((f1 + f2 + f3) === 0) { $('#gmAddNumsBtn').attr('disabled', true); }
          else {
            $('#gmAddNumsBtn').attr('disabled', false);
          }
        });

        $('#priority').change(function () {
          if (this.checked) {
            f2 = 1;
          }
          else {
            f2 = 0;
          }

          if ((f1 + f2 + f3) === 0) {
            $('#gmAddNumsBtn').attr('disabled', true);
          }
          else {
            $('#gmAddNumsBtn').attr('disabled', false);
          }
        });

        $('.sel').change(function () {
          if (this.checked) {
            f3 = 1;
          }
          else {
            f3 = 0;
          }

          if ((f1 + f2 + f3) === 0) {
            $('#gmAddNumsBtn').attr('disabled', true);
          }
          else {
            $('#gmAddNumsBtn').attr('disabled', false);
          }
        });

        if ((f1 + f2 + f3) === 0) {
          $('#gmAddNumsBtn').attr('disabled', true);
        }
        else {
          $('#gmAddNumsBtn').attr('disabled', false);
        }

        let p_res = '';

        let assign = '';

        let prior = '';

        $('#gmAddNumsBtn').click(() => {
          if ($('.sel').is(':checked')) {
            p_res = $('input[type=radio][name=val]:checked').val();

            if (p_res && p_res !== '') {
             resolutionDiv.value = p_res;
            }
          }

          if ($('#Assigned').is(':checked')) {
            assign = $('input[type=checkbox][name=val3]:checked').val();
            assGrpDiv.value = assign;
          }

          if ($('#priority').is(':checked')) {
            prior = $('input[type=checkbox][name=val2]:checked').val();
          }

          $('#gmPopupContainer').hide();
        });
        $('#gmCloseDlgBtn').click(() => {
          $('#gmPopupContainer').hide();
        });
      }

      else {
        alert('Error! Please contact STA team');

        console.log('error: ', response);
      }
     }
    },
    onerror: function (response) {
      alert('Error! Please contact STA team');
      console.log('error: ', response);
    }
  });

  GM_addStyle('                                                 \
    #gmPopupContainer {                                         \
        height:                 60%;                            \
        max-height:             100%;                           \
        width:                  65%;                            \
        max-width:              100%;                           \
        overflow:               auto;                           \
        position:               fixed;                          \
        top:                    16%;                            \
        bottom:                 10%;                            \
        left:                   10%;                            \
        right:                  10%;                            \
        padding:                2%;                             \
        background:             white;                          \
        border:                 2px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        align:                  left;                           \
        margin-right:           2%;                             \
        margin-left:            0;                              \
        border:                 1px outset buttonface;          \
    }                                                           \
    #gmPopupContainer input{                                    \
        align:                  right;                          \
        margin-top:             0;                              \
        margin-left:            0;                              \
    }                                                           \
');
})();
