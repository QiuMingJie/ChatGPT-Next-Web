import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path, SAAS_CHAT_URL } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import Delete from "../icons/close.svg";
import Arrow from "../icons/arrow.svg";
import Logo from "../icons/logo.svg";
import { useMobileScreen } from "@/app/utils";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import { PasswordInput } from "./ui-lib";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import {
  trackSettingsPageGuideToCPaymentClick,
  trackAuthorizationPageButtonToCPaymentClick,
} from "../utils/auth-settings-events";
import clsx from "clsx";
import { userLogin } from "@/app/components/service";

const storage = safeLocalStorage();
const crypto = require("crypto");

export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goHome = () => navigate(Path.Home);
  async function hashPassword(password: string) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      hash.update(password);
      resolve(hash.digest("hex"));
    });
  }

  const goChat = async () => {
    // 请求登录接口
    const hashPwd = await hashPassword(accessStore.userPwd);
    console.log(accessStore.userName, hashPwd);
    const params = {
      createTime: Date.now(),
      remark: "",
      userId: accessStore.userName,
      userName: accessStore.userName,
      userPassword: hashPwd,
      userPhone: "",
      userType: "",
    };
    userLogin(params)
      .then((res: any) => {
        console.log(res);
        if (res.code === "200") {
          accessStore.update((access) => {
            access.userName = res.data.userName;
            access.userPwd = res.data.userPassword;
            access.userId = res.data.userId;
          });
          navigate(Path.Home);
        }
      })
      .catch(() => {});
  };
  const goSaas = () => {
    trackAuthorizationPageButtonToCPaymentClick();
    window.location.href = SAAS_CHAT_URL;
  };

  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "";
      access.userName = "";
      access.userPwd = "";
    });
  }; // Reset access code to empty string

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      {/* <TopBanner></TopBanner> */}
      <div className={styles["auth-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Auth.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>
      <div className={clsx("no-dark", styles["auth-logo"])}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>

      <div style={{ display: "none" }}>
        <PasswordInput
          style={{ marginTop: "3vh", marginBottom: "3vh" }}
          aria={Locale.Settings.ShowPassword}
          aria-label={Locale.Auth.Input}
          value={accessStore.accessCode}
          type="text"
          placeholder={Locale.Auth.Input}
          onChange={(e) => {
            accessStore.update(
              (access) => (access.accessCode = e.currentTarget.value),
            );
          }}
        />
      </div>

      {!accessStore.hideUserApiKey ? (
        <>
          <div style={{ display: "none" }}>
            <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
            <PasswordInput
              style={{ marginTop: "3vh", marginBottom: "3vh" }}
              aria={Locale.Settings.ShowPassword}
              aria-label={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
              value={accessStore.openaiApiKey}
              type="text"
              placeholder={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.openaiApiKey = e.currentTarget.value),
                );
              }}
            />
          </div>

          <div className={"user-input-container"} style={{ marginTop: "3vh" }}>
            <IconButton
              style={{ width: "43px", height: "36px" }}
              className="{password-eye}"
            />
            <input
              type="text"
              className={"password-input"}
              value={accessStore.userName}
              placeholder={Locale.Settings.Access.User.UserName.Placeholder}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.userName = e.currentTarget.value),
                );
              }}
            />
          </div>
          <PasswordInput
            style={{ marginTop: "3vh", marginBottom: "3vh" }}
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.User.Password.Placeholder}
            value={accessStore.userPwd}
            type="text"
            placeholder={Locale.Settings.Access.User.Password.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.userPwd = e.currentTarget.value),
              );
            }}
          />
          {/* <PasswordInput
            style={{ marginTop: "3vh", marginBottom: "3vh" }}
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.Google.ApiKey.Placeholder}
            value={accessStore.googleApiKey}
            type="text"
            placeholder={Locale.Settings.Access.Google.ApiKey.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.googleApiKey = e.currentTarget.value),
              );
            }}
          /> */}
        </>
      ) : null}

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={goChat}
        />
        {/* <IconButton
          text={Locale.Auth.SaasTips}
          onClick={() => {
            goSaas();
          }}
        /> */}
      </div>
    </div>
  );
}

function TopBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMobileScreen();
  useEffect(() => {
    // 检查 localStorage 中是否有标记
    const bannerDismissed = storage.getItem("bannerDismissed");
    // 如果标记不存在，存储默认值并显示横幅
    if (!bannerDismissed) {
      storage.setItem("bannerDismissed", "false");
      setIsVisible(true); // 显示横幅
    } else if (bannerDismissed === "true") {
      // 如果标记为 "true"，则隐藏横幅
      setIsVisible(false);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    storage.setItem("bannerDismissed", "true");
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div
      className={styles["top-banner"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx(styles["top-banner-inner"], "no-dark")}>
        <Logo className={styles["top-banner-logo"]}></Logo>
        <span>
          {Locale.Auth.TopTips}
          <a
            href={SAAS_CHAT_URL}
            rel="stylesheet"
            onClick={() => {
              trackSettingsPageGuideToCPaymentClick();
            }}
          >
            {Locale.Settings.Access.SaasStart.ChatNow}
            <Arrow style={{ marginLeft: "4px" }} />
          </a>
        </span>
      </div>
      {(isHovered || isMobile) && (
        <Delete className={styles["top-banner-close"]} onClick={handleClose} />
      )}
    </div>
  );
}
