import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

import "./Voice.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const voiceUnsupportToast = () => {
  toast.error("Your Browser Does Not Support Voice Input", {
    theme: "dark",
    autoClose: false,
  });
};

const notMicrophoneAvailableToast = () => {
  toast.error("Plz Allow Access To Microphone To Proceed", {
    theme: "dark",
    autoClose: false,
  });
};

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = false;
mic.interimResults = true;
mic.lang = "en-US";

export default function VoiceBox({ open, close, searchInput }) {
  const [isActiveAnimation, setIsActiveAnimation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");

  console.log("Voice box is render");

  const handleListen = () => {
    mic.start();
    mic.onend = () => {
      handleClose();
    };

    mic.onstart = () => {
      setIsActiveAnimation(true);
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      //  console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  // const {
  //   transcript,
  //   finalTranscript,
  //   resetTranscript,
  //   listening,
  //   browserSupportsSpeechRecognition,
  //   isMicrophoneAvailable,
  //   getRecognition,
  // } = useSpeechRecognition();

  // useEffect(() => {
  //   setSearch(transcript);
  // }, [transcript]);

  // useEffect(() => {
  //   handleClose();
  // }, [finalTranscript]);

  const handleClose = async () => {
    setIsActiveAnimation(false);
    let temp = "";
    setNote((prev) => {
      temp = prev;
      return "";
    });
    searchInput(temp);
    mic.stop();
    close();
  };

  const handleListing = () => {
    // if (!browserSupportsSpeechRecognition) {
    //   voiceUnsupportToast();
    // }

    navigator.webkitGetUserMedia(
      { audio: true },
      function () {
        setIsActiveAnimation(true);
        //  SpeechRecognition.startListening({});
      },
      function () {
        notMicrophoneAvailableToast();
      }
    );
  };

  return (
    <BootstrapDialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      className="BootStrapDia"
    >
      <div className="VoiceWrapper">
        <div className="Cancle">
          <CloseIcon
            onClick={() => {
              handleClose();
            }}
            className="closeIcon"
          />
        </div>
        <div className="Top">
          {/* <h1> {listening} </h1> */}
          <p>{note}</p>
        </div>
        <div className="Bottom">
          <span className="iconWrapper active">
            <div className={isActiveAnimation ? "pulse-ring" : ""}></div>
            <KeyboardVoiceIcon
              onClick={() => {
                handleListen();
                // setIsActiveAnimation(true);
                // handleListing();
                //  setIsListening((prevState) => !prevState);
              }}
              className="Icon1"
            />
          </span>
        </div>
      </div>
    </BootstrapDialog>
  );
}
