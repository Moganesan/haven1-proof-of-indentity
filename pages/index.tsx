import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import WalletIcon from "@mui/icons-material/Wallet";
import GroupIcon from "@mui/icons-material/Groups";
import VerifyIcon from "@mui/icons-material/TaskAlt";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { useState } from "react";
import { StepIconProps } from "@mui/material/StepIcon";
import { MetaMaskButton, useAccount } from "@metamask/sdk-react-ui";
import { useAuth0 } from "@auth0/auth0-react";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const connectMetamask = () => {};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <WalletIcon />,
    2: <GroupIcon />,
    3: <VerifyIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Connect your wallet",
  "Connect your social accounts",
  "Verify your identity",
];

export default function CustomizedSteppers() {
  const { isConnected } = useAccount();
  const [socialAccount, setSocialAccount] = useState<any>();
  const [currentStep, setCurrentStep] = useState(0);
  const [aadhaar, setAadhaar] = useState("");
  const { loginWithPopup, isAuthenticated, logout, user } = useAuth0();

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log(user);
      const auth = {
        email: user?.email,
        name: user?.name,
        picture: user?.picture,
        sub: user?.sub,
      };
      setSocialAccount(auth);
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1 className="font-bold text-center text-4xl mt-40 mb-24">Social Hub</h1>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={currentStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <h1 className="text-white">{label}</h1>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <div className="flex items-center justify-center mt-32">
        {currentStep == 0 ? (
          <div className="flex flex-col">
            <MetaMaskButton theme={"dark"} color="blue"></MetaMaskButton>
            {isConnected && (
              <button
                className="px-3 py-2 bg-orange-400 mt-10"
                onClick={() => nextStep()}
              >
                Next
              </button>
            )}
          </div>
        ) : currentStep == 1 ? (
          <div>
            {socialAccount && (
              <div className="text-center">
                <h1 className="text-green-500">Google account linked!</h1>
                <div className="flex mt-3 items-center">
                  <div className="w-14 text-white h-14 rounded-full overflow-hidden">
                    <img src={socialAccount.picture} />
                  </div>
                  <h1 className="font-bold ml-3">{socialAccount.name}</h1>
                </div>
              </div>
            )}
            {socialAccount ? (
              <button
                className="px-3 py-2 bg-orange-400 mt-10"
                onClick={() => nextStep()}
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => loginWithPopup()}
                className="px-3 py-2 bg-orange-400 mt-10"
              >
                Connect Social Accounts
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <input
              className="px-4 py-2 text-black"
              placeholder="Enter 12 digit aadhaar"
              onChange={(e) => setAadhaar(e.target.value)}
              value={aadhaar}
            />
            <button
              className="px-3 py-2 bg-orange-400 mt-10"
              onClick={() => nextStep()}
            >
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
