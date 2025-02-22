import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
import clsx from "clsx";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  const { pathname: currentPath } = useLocation();
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={clsx(styles["chat-item"], {
            [styles["chat-item-selected"]]:
              props.selected &&
              (currentPath === Path.Chat || currentPath === Path.Home),
          })}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={clsx(styles["chat-item-avatar"], "no-dark")}>
                <MaskAvatar
                  avatar={props.mask.avatar}
                  model={props.mask.modelConfig.model}
                />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className={styles["chat-item-date"]}>{props.time}</div>
              </div>
            </>
          )}

          {/* <div
            className={styles["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div> */}
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };
  const list = [
    {
      id: nanoid(),
      topic: "诊断练习",
      memoryPrompt: "",
      messages: [],
      stat: { tokenCount: 0, wordCount: 0, charCount: 0 },
      lastUpdate: Date.now(),
      lastSummarizeIndex: 0,
      mask: {
        avatar: "270d-fe0f",
        name: "诊断练习",
        context: [
          {
            id: "writer-0",
            role: "user",
            content: "我给你关键字，你发给我一些训练题目，我的关键字是：",
            date: "",
          },
        ],
        modelConfig: {
          model: "deepseek",
          providerName: "Alibaba",
          temperature: 1,
          top_p: 1,
          max_tokens: 2000,
          presence_penalty: 0,
          frequency_penalty: 0,
          sendMemory: true,
          historyMessageCount: 4,
          compressMessageLengthThreshold: 1000,
          compressModel: "",
          compressProviderName: "",
          enableInjectSystemPrompts: true,
          template: "{{input}}",
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        },
        lang: "cn",
        builtin: true,
        createdAt: Date.now(),
        id: 100001,
      },
    },
    {
      id: nanoid(),
      topic: "智能问答",
      memoryPrompt: "",
      messages: [],
      stat: { tokenCount: 0, wordCount: 0, charCount: 0 },
      lastUpdate: Date.now(),
      lastSummarizeIndex: 0,
      mask: {
        avatar: "1f978",
        name: "智能问答",
        context: [
          {
            id: "writer-0",
            role: "user",
            content:
              "我现在开始会问你一些问题，你根据你所知的知识回答我，我的问题是：",
            date: "",
          },
        ],
        modelConfig: {
          model: "deepseek",
          providerName: "Alibaba",
          temperature: 1,
          top_p: 1,
          max_tokens: 2000,
          presence_penalty: 0,
          frequency_penalty: 0,
          sendMemory: true,
          historyMessageCount: 4,
          compressMessageLengthThreshold: 1000,
          compressModel: "",
          compressProviderName: "",
          enableInjectSystemPrompts: true,
          template: "{{input}}",
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        },
        lang: "cn",
        builtin: true,
        createdAt: Date.now(),
        id: 100000,
      },
    },
    {
      id: nanoid(),
      topic: "知识库",
      memoryPrompt: "",
      messages: [],
      stat: { tokenCount: 0, wordCount: 0, charCount: 0 },
      lastUpdate: Date.now(),
      lastSummarizeIndex: 0,
      mask: {
        avatar: "1f4da",
        name: "知识库",
        context: [
          {
            id: "writer-0",
            role: "user",
            content:
              "你整合一下中医诊断学资料，然后我会发给你关键词，你根据我的关键词发给我对应的一些中医诊断资料，我的第一个关键词是：",
            date: "",
          },
        ],
        modelConfig: {
          model: "deepseek",
          providerName: "Alibaba",
          temperature: 1,
          top_p: 1,
          max_tokens: 2000,
          presence_penalty: 0,
          frequency_penalty: 0,
          sendMemory: true,
          historyMessageCount: 4,
          compressMessageLengthThreshold: 1000,
          compressModel: "",
          compressProviderName: "",
          enableInjectSystemPrompts: true,
          template: "{{input}}",
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        },
        lang: "cn",
        builtin: true,
        createdAt: Date.now(),
        id: 100002,
      },
    },
  ];
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* {JSON.stringify(sessions)} */}
            {list.map((item, i) => (
              <ChatItem
                title={item.topic}
                time={new Date(item.lastUpdate).toLocaleString()}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(i);
                }}
                onDelete={async () => {
                  if (
                    (!props.narrow && !isMobileScreen) ||
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    chatStore.deleteSession(i);
                  }
                }}
                narrow={props.narrow}
                mask={item.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
