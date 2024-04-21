import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import { sendDataAboutError } from "./tgterminal.js";
import { sendDataAboutText } from "./tgterminal.js";

const TOKENs = [
	"6654105779:AAEnCdIzKS_cgJUg4rMY8yNM3LPP5iZ-d_A",
	"7013930192:AAGZWxSUCdJTYBoFtBguQ-qaFCLPNDN5q_k",
];

const TOKEN = TOKENs[1]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const stepanovId = "5786876945";
const jackId = "6815420098";
let BotName = "sch27masterclass";

//? МАССИВЫ ДАННЫХ

let usersData = [];

let textMessageForAllUsers = "",
	match = null;

bot.setMyCommands([
	{
		command: "/restart",
		description: "Перезапуск 👾",
	},
]);

//? ФУНКЦИИ

async function firstMeeting(chatId, numOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numOfStage) {
			case 1:
				dataAboutUser.userAction = "firstMeeting1";

				await bot
					.sendMessage(chatId, "ㅤ")
					.then(
						(message) => (dataAboutUser.messageId = message.message_id)
					);

				await bot.editMessageText(
					`Привет! Я <B>Опросничок!</B>👋\nЯ устраиваю <i>разнообразные</i> <B>опросы для школьников!</B> 😊\n\nСегодня <B>тебе</B> предстоит пройти опрос о том, <B>как ты проводишь свой день!</B> 😉\n\nПросьба <B>внимательно</B> читать вопросы и <b>правильно</b> отвечать на них❗`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Поехали! 👍",
										callback_data: "firstMeeting2",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "firstMeeting2";
				await bot.editMessageText(
					`Теперь ты знаешь меня, <b>а я тебя еще нет!</b> 🤔\n\nНапиши пожалуйста <B>ниже, свое фамилию и имя! \n\nПример:</B>  <code>Ефремов Вася</code>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function Questions(chatId, numOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numOfStage) {
			case 1:
				dataAboutUser.userAction = `Questions1`;

				// [name1, name2] = dataAboutUser.fullName.split(" ");

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i>\n\n${dataAboutUser.fullName},</b> приятно познакомиться! 😃\n\nПервый вопрос!\n<b><I>Во сколько ты просыпаешься? 🤔</I>\n\nПример: <code>в 7:30</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);

				break;
			case 2:
				dataAboutUser.userAction = `Questions2`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nПрекрасно! 👍\n\n<b><I>Делаешь ли ты зарядку по утрам? 🤔</I></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Делаю ✅",
										callback_data: `yesOnQuestion${numOfStage}`,
									},
									{
										text: "Не делаю ❌",
										callback_data: `noOnQuestion${numOfStage}`,
									},
								],
							],
						},
					}
				);

				break;
			case 3:
				dataAboutUser.userAction = `Questions3`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nОтлично! Теперь скажи..\n\n<b><I>Сколько по времени, у тебя занимает дорога в школу? 🤔</I>\n\nПример: <code>10 минут</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);
				break;
			case 4:
				dataAboutUser.userAction = `Questions4`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nКласс! Продолжай! 😁\n\n<b><I>А насколько долго ты выполняешь Д/З? 🤔</I>\n\nПример: <code>3 часа</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);
				break;
			case 5:
				dataAboutUser.userAction = `Questions5`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nМолодец! Сейчас хороший вопрос..\n\n<b><I>Во сколько ты обычно приступаешь к урокам? 🤔</I>\n\nПример: <code>в 15:30</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);
				break;
			case 6:
				dataAboutUser.userAction = `Questions6`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nСупер, теперь ответь..\n\n<b><I>Ходишь ли ты на дополнительные занятия или к репетиторам? 🤔</I></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Хожу ✅",
										callback_data: `yesOnQuestion${numOfStage}`,
									},
									{
										text: "Не нужно ❌",
										callback_data: `noOnQuestion${numOfStage}`,
									},
								],
							],
						},
					}
				);
				break;
			case 7:
				dataAboutUser.userAction = `Questions7`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nПрекрасно! 👍\n\n<b><I>Ты занимаешься в какой-либо спортивной секции? 🤔</I></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Занимаюсь ✅",
										callback_data: `yesOnQuestion${numOfStage}`,
									},
									{
										text: "Не интересно ❌",
										callback_data: `noOnQuestion${numOfStage}`,
									},
								],
							],
						},
					}
				);
				break;
			case 8:
				dataAboutUser.userAction = `Questions8`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nУ тебя отлично получается! 😁\n\n<b><I>Ты придерживаешься режима дня? 🤔</I></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Придерживаюсь ✅",
										callback_data: `yesOnQuestion${numOfStage}`,
									},
									{
										text: "Не хочу ❌",
										callback_data: `noOnQuestion${numOfStage}`,
									},
								],
							],
						},
					}
				);
				break;
			case 9:
				dataAboutUser.userAction = `Questions9`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nОсталось совсем чуть-чуть! 😉\n\n<b><I>А во сколько ты ложишься спать? 🤔</I>\n\nПример: <code>в 21:40</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);
				break;
			case 10:
				dataAboutUser.userAction = `Questions10`;

				await bot.editMessageText(
					`<b><i>Вопрос ${numOfStage} / 10</i></b>\n\nИии... Финальный вопрос! 😃\n\n<b><I>Сколько времени в день ты проводишь за телефоном и компьютером? 🤔</I>\n\nПример: <code>5 часов</code></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
					}
				);

				break;
			case 11:
				dataAboutUser.userAction = "";
				if (chatId != qu1z3xId && chatId != stepanovId) {
					dataAboutUser.questionnaireIsOver = true;
				}

				await bot.editMessageText(
					`<i>Опрос <b>успешно</b> пройден! ✅</i>\n\n<b>${dataAboutUser.fullName},\nСпасибо тебе за уделенное время! </b>😁\n\n<i>Мой создатель <b>очень хотел бы,</b> чтобы <B>ваш класс</B> оценил его крупные проекты! 👇😁</i>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Цифровичок 🤖",
										url: "https://t.me/digschbot",
									},
									{
										text: "Спортивичок 🏀",
										url: "https://t.me/digjudgebot",
									},
								],
							],
						},
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function dataLists(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	let text = "";

	try {
		if (!usersData.find((obj) => obj.questionnaireIsOver)) {
			text = "Пока что пусто 🏝️";
		}
		for (let i = 0; i < usersData.length; i++) {
			if (usersData[i].questionnaireIsOver) {
				text += `[${i + 1}] ${usersData[i].fullName}\nПодъем: ${
					usersData[i].timeToWakeUp
				}, Зарядка: ${
					usersData[i].doMorningWorkout ? "Есть ✅" : "Нет ❌"
				}\nВремя до школы: ${usersData[i].timeForGoToSchool}\nДомашка: ${
					usersData[i].timeToDoHomework
				}, по ${usersData[i].timeForHomework}\nРепетитор: ${
					usersData[i].visitAdditionalTeacher ? "Есть ✅" : "Нет❌"
				}, Спорт-секции: ${
					usersData[i].visitSportSection ? "Есть ✅" : "Нет ❌"
				}\nРутина: ${
					usersData[i].observeDailyRoutine ? "Есть ✅" : "Нет ❌"
				}, Отход ко сну: ${usersData[i].timeToSleep}\nВремя за экраном: ${
					usersData[i].screenTime
				}`;
			}
		}

		fs.writeFile("dataAboutStudents.txt", text, (err) => {
			if (err) throw err;

			// Отправляем файл пользователю
			bot.sendDocument(chatId, "./dataAboutStudents.txt", {
				caption: "Данные опрошенных",
			}).then((message) => {
				dataAboutUser.messageIdOther = message.message_id;
			});
		});
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function StartAll() {
	if (TOKEN == TOKENs[0]) {
		BotName = "digsch27_bot";
	} else if (TOKEN == TOKENs[1]) {
		BotName = "digformsbot";
	}

	try {
		bot.on("message", async (message) => {
			const chatId = message.chat.id;
			const text = message.text;
			let dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

			try {
				if (!dataAboutUser) {
					usersData.push({
						chatId: message.chat.id,
						messageId: "",
						messageIdOther: "",
						userAction: "",
						fullName: "",
						timeToWakeUp: null,
						doMorningWorkout: null,
						timeForGoToSchool: null,
						timeForHomework: null,
						timeToDoHomework: null,
						visitAdditionalTeacher: null,
						visitSportSection: null,
						observeDailyRoutine: null,
						timeToSleep: null,
						screenTime: null,
						questionnaireIsOver: false,
					});
				}

				if (usersData.find((obj) => obj.chatId == chatId)) {
					dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
					//? КОМАНДЫ
					switch (text) {
						case "/start":
						case "/restart":
							if (dataAboutUser && !dataAboutUser.questionnaireIsOver) {
								try {
									await bot.deleteMessage(
										chatId,
										dataAboutUser.messageIdOther
									);
								} catch (error) {}
								firstMeeting(chatId);
							} else Questions(chatId, 11);
							break;
						case "/data":
							if (chatId == qu1z3xId || chatId == stepanovId) {
								dataLists(chatId);
							}
							break;
						case "":
							break;
						case "":
							break;
					}

					if (
						dataAboutUser.userAction.includes("Questions") &&
						!text.includes("/")
					) {
						match = dataAboutUser.userAction.match(/^Questions(\d+)$/);
						switch (parseInt(match[1])) {
							case 1:
								dataAboutUser.timeToWakeUp = text;
								Questions(chatId, 2);
								break;
							case 3:
								dataAboutUser.timeForGoToSchool = text;
								Questions(chatId, 4);
								break;
							case 4:
								dataAboutUser.timeForHomework = text;
								Questions(chatId, 5);
								break;
							case 5:
								dataAboutUser.timeToDoHomework = text;
								Questions(chatId, 6);
								break;
							case 9:
								dataAboutUser.timeToSleep = text;
								Questions(chatId, 10);
								break;
							case 10:
								dataAboutUser.screenTime = text;
								Questions(chatId, 11);
								break;
						}
					}

					if (
						dataAboutUser.userAction == "firstMeeting2" &&
						!text.includes("/")
					) {
						dataAboutUser.fullName = text;

						Questions(chatId, 1);
					}
				}

				bot.deleteMessage(chatId, message.message_id);

				if (chatId != qu1z3xId) {
					sendDataAboutText(
						message.from.first_name,
						message.from.username,
						message.chat.id,
						text
					);
				}
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}
		});

		//? ОБРАБОТЧИК КЛАВИАТУРЫ ПОД СООБЩЕНИЯМИ

		bot.on("callback_query", (query) => {
			const chatId = query.message.chat.id;
			const data = query.data;

			const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

			try {
				if (usersData.find((obj) => obj.chatId == chatId)) {
					if (data.includes("yesOnQuestion")) {
						let match = data.match(/^yesOnQuestion(\d+)$/);

						console.log(3);
						switch (parseInt(match[1])) {
							case 2:
								dataAboutUser.doMorningWorkout = true;
								Questions(chatId, 3);
								break;
							case 6:
								dataAboutUser.visitAdditionalTeacher = true;
								Questions(chatId, 7);
								break;
							case 7:
								dataAboutUser.visitSportSection = true;
								Questions(chatId, 8);
								break;
							case 8:
								dataAboutUser.observeDailyRoutine = true;
								Questions(chatId, 9);
								break;
						}
					} else if (data.includes("noOnQuestion")) {
						let match = data.match(/^noOnQuestion(\d+)$/);

						switch (parseInt(match[1])) {
							case 2:
								dataAboutUser.doMorningWorkout = false;
								Questions(chatId, 3);
								break;
							case 6:
								dataAboutUser.visitAdditionalTeacher = false;
								Questions(chatId, 7);
								break;
							case 7:
								dataAboutUser.visitSportSection = false;
								Questions(chatId, 8);
								break;
							case 8:
								dataAboutUser.observeDailyRoutine = false;
								Questions(chatId, 9);
								break;
						}
					}

					//? КОМАНДЫ
					switch (data) {
						case "firstMeeting1":
							firstMeeting(chatId, 1);
							break;
						case "firstMeeting2":
							firstMeeting(chatId, 2);
							break;
						case "adminMenu":
							adminMenu(chatId);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;

						default:
							break;
					}
				}
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}
		});
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

StartAll();
