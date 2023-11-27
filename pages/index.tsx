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
import VerifyBadge from "@mui/icons-material/CheckOutlined";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { useState } from "react";
import { StepIconProps } from "@mui/material/StepIcon";
import { MetaMaskButton, useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import Abi from "@/abi.json";
import { useAuth0 } from "@auth0/auth0-react";

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

const ProfileViewComponent = ({ props }: any) => {
  return (
    <div className="grid place-items-center">
      <div className="bg-slate-800 h-96 w-72 py-5">
        <div className="flex items-center flex-col px-3">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src={props.picture} />
          </div>
          <h1 className="font-bold text-2xl mt2">{props.name}</h1>
          <h1 className="bg-green-500 rounded-md mt-3 text-white">
            <>
              <VerifyBadge />
            </>
          </h1>
          <button
            className="px-3 py-2 bg-orange-400 w-full mt-10"
            onClick={async () => {
              await props.logoutWallet();
              await props.logout();
            }}
          >
            Logout
          </button>

          <button
            className="px-3 py-2 w-full bg-orange-400 mt-6"
            onClick={() => props.fetchAccount()}
          >
            Fetch Account
          </button>
        </div>
      </div>
    </div>
  );
};

const steps = [
  "Connect your wallet",
  "Connect your social accounts",
  "Verify your identity",
];

export default function CustomizedSteppers() {
  const { isConnected } = useAccount();
  const [socialAccount, setSocialAccount] = useState<any>();
  const [currentStep, setCurrentStep] = useState(0);
  const { loginWithPopup, isAuthenticated, logout, user } = useAuth0();
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);

  const nextStep = async () => {
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (changeProfile) {
      ChangeProfile();
    }
  }, [changeProfile]);
  const logoutWallet = async () => {
    const contractAddress: any = process.env.NEXT_PUBLIC_SOCIAL_HUB_CONTRACT;
    console.log("COntract Address", contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    console.log(await signer.getAddress());
    const contract = new ethers.Contract(contractAddress, Abi, signer);

    try {
      const contractCall = await contract.logout(signer.getAddress());

      await contractCall.wait();
    } catch (err) {
      console.log(err);
    }
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

  const fetchAccount = async () => {
    const contractAddress: any = process.env.NEXT_PUBLIC_SOCIAL_HUB_CONTRACT;
    console.log("COntract Address", contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    console.log(await signer.getAddress());
    const contract = new ethers.Contract(contractAddress, Abi, signer);

    const checkProfile = await contract.verifyWallet(signer.getAddress());
    if (checkProfile) {
      alert(checkProfile);
    }
  };

  const verifyWallet = async () => {
    setVerificationCompleted(true);
    const contractAddress: any = process.env.NEXT_PUBLIC_SOCIAL_HUB_CONTRACT;
    console.log("COntract Address", contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    console.log(await signer.getAddress());
    const contract = new ethers.Contract(contractAddress, Abi, signer);

    try {
      const checkProfile = await contract.verifyWallet(signer.getAddress());
      console.log(checkProfile);
      if (checkProfile) {
        setVerificationCompleted(true);
        return;
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const contractCall = await contract.addVerifiedUser(
        socialAccount.name.toString(),
        socialAccount.sub.toString(),
        socialAccount.email.toString(),
        socialAccount.picture.toString()
      );

      await contractCall.wait();

      setVerificationCompleted(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-center text-4xl mt-40 mb-24">Social Hub</h1>
      {verificationCompleted ? (
        <ProfileViewComponent
          props={{
            ...socialAccount,
            loginWithPopup: loginWithPopup,
            setChangeProfile,
            logout,
            logoutWallet,
            fetchAccount,
          }}
        />
      ) : (
        <>
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
                <button
                  className="px-3 py-2 bg-orange-400 mt-10"
                  onClick={() => verifyWallet()}
                >
                  Verify
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
