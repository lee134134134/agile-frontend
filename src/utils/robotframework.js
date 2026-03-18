// CodeMirror mode for Robot Framework
(function(mod) {
//   if (typeof exports == "object" && typeof module == "object") // CommonJS
//     mod(require("../../lib/codemirror"));
//   else if (typeof define == "function" && define.amd) // AMD
//     define(["../../lib/codemirror"], mod);
//   else // Plain browser env
//     mod(CodeMirror);
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("robotframework", function() {
  // Keywords that define sections (support both English and Chinese)
  var sectionKeywords = ["^\\*{3}[^*]+\\*{3}$"];
                         
  // Built-in settings
  var settings = ["Library", "Resource", "Variables", "Documentation", "Metadata",
                  "Suite Setup", "Suite Teardown", "Test Setup", "Test Teardown",
                  "Test Template", "Test Timeout", "Test Tags", 
                  "Task Setup", "Task Teardown", "Task Template", "Task Timeout"];
                  
  // Common Robot Framework builtin keywords
  var builtinKeywords = [
    // BuiltIn library
    "Run Keyword", "Run Keyword If", "Run Keyword Unless", "Repeat Keyword",
    "Wait Until Keyword Succeeds", "Run Keywords", "Set Variable", "Set Test Variable",
    "Set Suite Variable", "Set Global Variable", "Variable Should Exist",
    "Variable Should Not Exist", "Get Variable Value", "Get Variables",
    "Get Environment Variable", "Set Environment Variable", "Log", "Log Many",
    "Comment", "Set Log Level", "Import Library", "Import Variables",
    "Import Resource", "Sleep", "Evaluate", "Run", "Should Be True",
    "Should Not Be True", "Fail", "Fatal Error", "Exit For Loop", "Exit For Loop If",
    "Continue For Loop", "Continue For Loop If", "Return From Keyword",
    "Return From Keyword If", "Pass Execution", "Pass Execution If", "Get Time",
    "Get Date", "Convert Date", "Sleep", "Wait Until Keyword Succeeds",
    
    // OperatingSystem library keywords
    "Create File", "Remove File", "File Should Exist", "File Should Not Exist",
    "List Directory", "Get File", "Get Binary File", "Grep File",
    
    // String library keywords
    "Convert To Lowercase", "Convert To Uppercase", "Replace String",
    "Split String", "Get Length", "Get Substring", "Should Be Equal As Strings",
    
    // Collections library keywords
    "Create List", "Create Dictionary", "Get From List", "Get From Dictionary",
    "Set To Dictionary", "Append To List", "Insert Into List", "Remove Values From List",
    
    // Screenshot library keywords
    "Take Screenshot", "Take Screenshot Without Embedding",
    
    // SeleniumLibrary keywords
    "Open Browser", "Go To", "Click Element", "Input Text", "Wait Until Page Contains",
    "Wait Until Page Contains Element", "Title Should Be", "Page Should Contain",
    "Close Browser", "Capture Page Screenshot", "Wait Until Element Is Visible", "Wait Until Element Is Enabled",
    "Set Selenium Implicit Wait", "Maximize Browser Window",
    "Get Text", "Get Element Count",
    "Select Frame", "Unselect Frame"
  ];
  
  // Test case settings
  var testCaseSettings = ["[Documentation]", "[Tags]", "[Setup]", "[Teardown]", "[Template]", "[Timeout]"];

  function isSectionStart(line) {
    for (var i = 0; i < sectionKeywords.length; i++) {
      if (line.match(new RegExp(sectionKeywords[i], "i"))) {
        return true;
      }
    }
    return false;
  }

  function isSetting(line) {
    for (var i = 0; i < settings.length; i++) {
      if (line.indexOf(settings[i] + " ") === 0 || line.indexOf(settings[i] + "\t") === 0) {
        return true;
      }
    }
    return false;
  }
  
  function isTestCaseSetting(token) {
    for (var i = 0; i < testCaseSettings.length; i++) {
      if (token === testCaseSettings[i]) {
        return true;
      }
    }
    return false;
  }

  function isBuiltinKeyword(word) {
    return builtinKeywords.indexOf(word) !== -1;
  }

  function isVariable(token) {
    return token.match(/^\$\{.*\}$/) || token.match(/^@\{.*\}$/) || token.match(/^&\{.*\}$/);
  }

  // Check if we are in the Test Cases section
  function isInTestCasesSection(state) {
    return state.inTestCases;
  }

  // Check if we are in the Keywords section
  function isInKeywordsSection(state) {
    return state.inKeywords;
  }

  // New function to check if we have a 4-space separator
  function hasFourSpaceSeparator(stream) {
    var pos = stream.pos;
    if (stream.string.substr(pos, 4) === "    ") { // Four spaces
      return true;
    }
    return false;
  }

  return {
    token: function(stream, state) {
      var ch = stream.peek();
      var column = stream.column();
      
      // Skip whitespace at the beginning of line to determine section
      if (column === 0 && stream.match(/^\s*\*{3}[^*]+\*{3}\s*$/i)) {
        // Check if it's a Test Cases or Keywords section
        if (stream.match(/^\s*\*{3}\s*Test Cases\s*\*{3}/i) || stream.match(/^\s*\*{3}\s*用例\s*\*{3}/i)) {
          state.inTestCases = true;
          state.inKeywords = false;
        } else if (stream.match(/^\s*\*{3}\s*Keywords\s*\*{3}/i) || stream.match(/^\s*\*{3}\s*关键字\s*\*{3}/i)) {
          state.inTestCases = false;
          state.inKeywords = true;
        } else {
          state.inTestCases = false;
          state.inKeywords = false;
        }
        return "header";
      }
      
      // Skip whitespace
      if (stream.eatSpace()) {
        return null;
      }
      
      // Comments start with #
      if (ch === "#") {
        stream.skipToEnd();
        return "comment";
      }
      
      // Check for section headers with spaces like "*** Keywords ***" or "*** 关键字 ***"
      var sectionHeaderMatch = stream.match(/^[\*]{3}[^\*]*[\*]{3}/, true);
      if (sectionHeaderMatch) {
        return "section";
      }
      
      // Check for test case or keyword settings like "[Documentation]"
      var testCaseSettingMatch = stream.match(/^\[[^\]]*\]/, true);
      if (testCaseSettingMatch) {
        return "setting";
      }
      
      // Check if we're at the beginning of a line in Test Cases or Keywords section
      // This is the key fix - we need to read the entire line for test case/keyword names
      if (column === 0 && (isInTestCasesSection(state) || isInKeywordsSection(state))) {
        // Read the entire rest of the line as a single token for test case/keyword names
        var fullLineToken = stream.match(/^.*/, true);
        if (fullLineToken) {
          return "def";
        }
      }
      
      // Check for variables that might contain spaces
      // Look for patterns like ${variable name} or @{list name} or &{dict name}
      var variableMatch = stream.match(/^[\$@&]\{[^}]*\}/, true);
      if (variableMatch) {
        return "variable";
      }
      
      // Parse tokens based on the new rule:
      // Consume characters until we hit a newline or 4-space separator
      var token = "";
      while (!stream.eol() && !hasFourSpaceSeparator(stream)) {
        token += stream.next();
      }
      
      // If we stopped at a 4-space separator, consume it
      if (hasFourSpaceSeparator(stream)) {
        stream.match(/^ {4}/);
      }
      
      // If token is empty, move to the next character
      if (!token) {
        stream.next();
        return null;
      }
      
      // Settings
      if (isSetting(token)) {
        return "builtin";
      }
      
      // Variables (for cases not caught by the regex above)
      if (isVariable(token)) {
        return "variable";
      }
      
      // Builtin keywords
      if (isBuiltinKeyword(token)) {
        return "keyword";
      }
      
      // Arguments (words that follow keywords)
      if (column > 0 && !isSectionStart(token)) {
        return "string";
      }
      
      return null;
    },
    
    startState: function() {
      return {
        inTestCases: false,
        inKeywords: false
      };
    }
  };
});

CodeMirror.defineMIME("text/x-robotframework", "robotframework");

});