import {
    Client,
    StringSelectMenuBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Guild,
    GuildMember,
    ButtonInteraction,
    StringSelectMenuInteraction,
    BaseGuildTextChannel,
    AttachmentBuilder
} from "discord.js";

import {
    UserData as IUserData,
    Club as IClub,
    Quest as IQuest,
    Item as IItem,
    Relation as IRelation,
    Shop as IShop,
    nextLevel,
    Action,
    ClubQuestData,
    UserQuest,
    RelationProperty,
    StickyMessage,
} from 'my-types';

export class UserData {
    id: string;
    client: Client;
    guild: Guild;
    member: GuildMember;
    data: IUserData | null;

    constructor(id: string, client: Client);

    static create(id: string, client: Client, projection: string): Promise<UserData>;

    initialize(projection: string): Promise<UserData>;

    update(): Promise<void>;

    get balanceString(): string;

    get gemString(): string;

    getInventoryEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] }>;

    addBal(amount: number): Promise<void>;

    takeBal(amount: number): Promise<void>;

    addGem(amount: number): Promise<void>;

    takeGem(amount: number): Promise<void>;

    addItem(item_id: string, amount: number): Promise<void>;

    takeItem(item_id: string, amount: number): Promise<void>;

    addQuest(quest_ids: string[]): Promise<void>;

    refreshDailyQuest(): Promise<void>;

    refreshWeeklyQuest(): Promise<void>;

    rerollQuests(fee: number): Promise<void>;

    getProfileImageEmbed(type: string): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[] }>;

    addFriend(friend_id: string): Promise<void>;

    removeFriend(friend_id: string): Promise<void>;

    getRelationListEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<StringSelectMenuBuilder>[] } | undefined>;

    getGiftsEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<StringSelectMenuBuilder>[] }>;

    getQuestEmbed(category: string): Promise<{ embeds: EmbedBuilder[]; components: [ActionRowBuilder<StringSelectMenuBuilder>, ActionRowBuilder<ButtonBuilder>] }>;

    getClubId(): Promise<string | undefined>;

    get ownedAppellations(): Set<string>;
}

export class Club {
    id: string;
    client: Client;
    guild: Guild;
    data: IClub | null;

    constructor(id: string, client: Client);

    static create(id: string, client: Client, projection?: string): Promise<Club>;

    initialize(projection?: string): Promise<Club>;

    update(): Promise<void>;

    get icon(): string;

    get thumbnail(): string;

    get clubName(): string;

    get nextLevel(): nextLevel;

    get levelString(): string;

    get donatorBonus(): number;

    getEmbed(): Promise<{ embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] }>;

    getPremiumInfoEmbed(): Promise<EmbedBuilder>;

    deactivatePremium(): Promise<void>;

    removeRoomProtect(): Promise<void>;

    getMemberListEmbed(page: number): Promise<{ embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[] }>;

    addMember(id: string, mod: string): Promise<void>;

    removeMember(id: string, mod: string): Promise<void>;

    getRoomClub(): Promise<{ embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[] }>;

    getRoomProtectSetting(): Promise<{ embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[] }>;

    getQuestEmbed(): Promise<{ embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[] }>;

    refreshDailyQuest(): Promise<void>;

    getFundEmbed(): { embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[] };

    addPoint(amount: number, reason: string): Promise<void>;

    addQuest(questId: string): Promise<void>;

    addFund(amount: number, id: string): Promise<void>;

    takeFund(amount: number, id: string, target: string): Promise<void>;

    writeLog(action: Action): Promise<void>;
}


export interface Log {
    time: number;
    action: Action;
}

export class ClubLog {
    id: string;
    log: Log;
    client: Client;
    guild: Guild;

    constructor(id: string, log: Log, client: Client);
    time: string;
    user: string;
    label(action: string): string;
    color(text: string | null): string;
    member: string;
    fund: string;
    level: string;
    quest: string;
    toString(): string;
    toEmbed(page: number): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[] }>;
}


export class QuestGenerator {
    id: string;
    club: Club;
    client: Client;
    data: ClubQuestData;
    constructor(id: string, club: Club, client: Client);
    generate(): Promise<ClubQuestData>;
}

export class ClubQuest {
    club: Club;
    data: ClubQuestData;
    client: Client;
    constructor(club: Club, data: ClubQuestData, client: Client);
    update(): Promise<void>;
    upProcess(value: number): Promise<void>;
    finish(): Promise<void>;
    readonly label: string;
}

export class Item {
    user_id: string;
    item_id: string;
    client: Client;
    guild: Guild;
    member: GuildMember;
    item: IItem;
    constructor(user_id: string, item_id: string, client: Client);
    getShopEmbed(shop_id: string, shopPage: number): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder[]; }>;
    getCostString(shop_id: number, shopPage: number): string | undefined;
    getCost(shop_id: number, shopPage: number): import('my-types').ItemCost;
    getInventoryEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder[]; }>;
    use(interaction: ButtonInteraction | StringSelectMenuInteraction, user: UserData): Promise<boolean>;
}

interface SortedLeaderboard {
    id: string;
    value: number;
    label: string;
    members?: string[];
}

interface LeaderboardEntry {
    id: string;
    value: string;
    label: string;
    emoji: string;
    color: string;
}

export class Leaderboard {
    id: string;
    user: UserData;
    client: Client;
    guild: Guild;
    leaderboards: Record<string, {
        id: string;
        value: string;
        label: string;
        emoji: string;
        color: string;
    }>;
    sorted: SortedLeaderboard[] | null;
    constructor(id: string, user: UserData, client: Client);
    static create(id: string, user: UserData, client: Client): Promise<Leaderboard>;
    sort(): Promise<SortedLeaderboard[]>;
    getMainEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder[]; }>;
    getEmbed(page: number): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder[]; }>;
}

export class ClubLeaderboard {
    id: string;
    club_id: string;
    client: Client;
    guild: Guild;
    leaderboards: {
        point: LeaderboardEntry;
        fund: LeaderboardEntry;
        level: LeaderboardEntry;
        [key: string]: LeaderboardEntry;
    };
    sorted: SortedLeaderboard[] | null;

    constructor(id: string, club_id: string, client: Client);
    static create(id: string, club_id: string, client: Client): Promise<ClubLeaderboard>;
    sort(): Promise<SortedLeaderboard[]>;
    getPosition(club_id: string): number;
    getMainEmbed(): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] }>;
    getEmbed(page: number): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[] }>;
}

export class Quest {
    id: string;
    client: Client;
    data: IQuest;
    constructor(id: string, client: Client);
    generate(): Promise<UserQuest>;
}

export class userQuest {
    user: UserData;
    data: IQuest;
    client: Client;
    constructor(user: UserData, data: IQuest, client: Client);
    update(): Promise<void>;
    upProcess(): Promise<void>;
    finish(): Promise<void>;
    get label(): string;
}


interface LevelProperty {
    level: number;
    point: number;
    emoji: string;
    label: string;
}

export class Relation {
    id: string;
    client: Client;
    guild: Guild;
    levelUpProperty: Record<string, LevelProperty>;
    rela: IRelation;
    m1: GuildMember;
    m2: GuildMember;

    constructor(id: string, client: Client);

    static create(id: string, client: Client, projection?: string): Promise<Relation>;

    initialize(projection?: string): Promise<Relation>;

    update(): Promise<void>;

    get properties(): RelationProperty;

    getImage(): Promise<AttachmentBuilder>;

    toEmbed(): Promise<{
        embeds: EmbedBuilder[],
        components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[],
        files: AttachmentBuilder[]
    }>;

    addGifts(user: UserData, item_id: string, amount: number, channel: BaseGuildTextChannel): Promise<number>;

    addPoints(user: UserData, point: number, channel: BaseGuildTextChannel): Promise<void>;

    getRingInfo(): Promise<{
        embeds: EmbedBuilder[],
        components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[],
        files: AttachmentBuilder[],
    }>;
}


export class Shop {
    shopId: string;
    user: UserData;
    client: Client;
    data: IShop;

    constructor(shopId: string, user: UserData, client: Client);

    getMainShop(): Promise<{
        embeds: EmbedBuilder[],
        components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[]
    }>;

    toEmbed(shopPage: number): Promise<{
        embeds: EmbedBuilder[],
        components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[]
    }>;
}

export class Sticky {
    client: Client;
    channel_id: string;
    data: StickyMessage

    constructor(client: Client, channel_id: string);

    update(): Promise<void>;
    static get(client: Client, channel_id: string): Promise<Sticky>;
    static create(client: Client, channel_id: string, message_data: StickyMessage): Promise<Sticky>
    get message(): { content: string; embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] };
    send(channel: BaseGuildTextChannel): Promise<void>;
}