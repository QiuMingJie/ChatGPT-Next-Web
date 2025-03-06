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
import { PasswordInput, showToast } from "./ui-lib";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import {
  trackSettingsPageGuideToCPaymentClick,
  trackAuthorizationPageButtonToCPaymentClick,
} from "../utils/auth-settings-events";
import clsx from "clsx";
import { userChangePassword } from "@/app/components/service";
const storage = safeLocalStorage();
const crypto = require("crypto");

export function AuthPages() {
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

  const changePwd = async () => {
    const { userId, userPwd, userNewPwd, userConfirmPwd } = accessStore;
    if (userPwd === "") {
      showToast("密码不能为空");
      return;
    } else if (userNewPwd === "") {
      showToast("新密码不能为空");
      return;
    } else if (userConfirmPwd === "") {
      showToast("确认密码不能为空");
      return;
    } else if (userNewPwd !== userConfirmPwd) {
      showToast("新密码和确认密码不一致");
      return;
    }
    if (userNewPwd === userConfirmPwd) {
      const hashOldPwd = await hashPassword(userPwd);
      const hashNewPwd = await hashPassword(userNewPwd);
      const params = {
        userId: userId,
        newPassword: hashNewPwd,
        oldPassword: hashOldPwd,
      };
      // 请求修改密码接口
      userChangePassword(params)
        .then((res: any) => {
          console.log(res);
          if (res.code === "200") {
            accessStore.update((access) => {
              access.userName = "";
              access.userPwd = "";
              access.userId = "";
              access.accessCode = "";
              access.userNewPwd = "";
              access.userConfirmPwd = "";
            });
            navigate(Path.Auth);
          } else if (res.status == "300") {
            showToast("useId不存在或原密码错误");
          } else if (res.code != "200") {
            showToast(res.msg);
          }
        })
        .catch(() => {});
    }
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
          text={Locale.SetPWd.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>
      <div className={clsx("no-dark", styles["auth-logo"])}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.SetPWd.Title}</div>

      {/* <div style={{ display: "none" }}>
        <PasswordInput
          style={{ marginTop: "3vh", marginBottom: "3vh" }}
          aria={Locale.Settings.ShowPassword}
          aria-label={Locale.Auth.Input}
          value={accessStore.accessCode}
          type="text"
          autoComplete="off"
          placeholder={Locale.Auth.Input}
          onChange={(e) => {
            accessStore.update(
              (access) => (access.accessCode = e.currentTarget.value),
            );
          }}
        />
      </div> */}

      {!accessStore.hideUserApiKey ? (
        <>
          {/* <div style={{ display: "none" }}>
            <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
            <PasswordInput
              style={{ marginTop: "3vh", marginBottom: "3vh" }}
              aria={Locale.Settings.ShowPassword}
              aria-label={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
              value={accessStore.openaiApiKey}
              type="text"
              autoComplete="off"
              placeholder={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.openaiApiKey = e.currentTarget.value),
                );
              }}
            />
          </div> */}

          {/* <div className={"user-input-container"} style={{ marginTop: "3vh" }}>
            <IconButton
              style={{ width: "43px", height: "36px" }}
              className="{password-eye}"
            />
            <input
              type="text"
              autoComplete="off"
              className={"password-input"}
              value={accessStore.userName}
              placeholder={Locale.Settings.Access.User.UserName.Placeholder}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.userName = e.currentTarget.value),
                );
              }}
            />
          </div> */}
          <PasswordInput
            style={{}}
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.User.Password.Placeholder}
            value={accessStore.userPwd}
            type="text"
            autoComplete="off"
            placeholder={Locale.Settings.Access.User.Password.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.userPwd = e.currentTarget.value),
              );
            }}
          />
          <div style={{ marginTop: "3vh" }}></div>
          <PasswordInput
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.User.newPassword.Placeholder}
            value={accessStore.userNewPwd}
            type="text"
            autoComplete="off"
            placeholder={Locale.Settings.Access.User.newPassword.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.userNewPwd = e.currentTarget.value),
              );
            }}
          />
          <div style={{ marginTop: "3vh" }}></div>
          <PasswordInput
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.User.ConfirmPassword.Placeholder}
            value={accessStore.userConfirmPwd}
            type="text"
            autoComplete="off"
            placeholder={
              Locale.Settings.Access.User.ConfirmPassword.Placeholder
            }
            onChange={(e) => {
              accessStore.update(
                (access) => (access.userConfirmPwd = e.currentTarget.value),
              );
            }}
          />
          <div style={{ marginTop: "3vh" }}></div>
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
          onClick={changePwd}
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
