create table QuestionTypes
(
    ID   int auto_increment
        primary key,
    Type varchar(32) not null,
    constraint QuestionTypes_ID_uindex
        unique (ID)
);

create table QuizTypes
(
    ID   int auto_increment
        primary key,
    Type varchar(32) not null,
    constraint QuizTypes_ID_uindex
        unique (ID)
);

create table Users
(
    ID       int auto_increment
        primary key,
    Nickname varchar(16)  not null,
    Password varchar(255) not null,
    constraint Users_ID_uindex
        unique (ID),
    constraint Users_Nickname_uindex
        unique (Nickname)
);

create table Quizzes
(
    ID     int auto_increment
        primary key,
    Author int          not null,
    TypeID int          not null,
    Name   varchar(128) not null,
    constraint Quizzes_ID_uindex
        unique (ID),
    constraint Quizzes_QuizTypes_ID_fk
        foreign key (TypeID) references QuizTypes (ID),
    constraint Quizzes_Users_ID_fk
        foreign key (Author) references Users (ID)
);

create table Questions
(
    ID       int auto_increment
        primary key,
    QuizID   int          not null,
    TypeID   int          not null,
    Question varchar(255) not null,
    Path     varchar(255) null,
    constraint Questions_ID_uindex
        unique (ID),
    constraint Questions_QuestionTypes_ID_fk
        foreign key (TypeID) references QuestionTypes (ID),
    constraint Questions_Quizzes_ID_fk
        foreign key (QuizID) references Quizzes (ID)
);

create table Answers
(
    ID         int auto_increment
        primary key,
    QuestionID int          not null,
    Answer     varchar(255) not null,
    IsCorrect  tinyint(1)   not null,
    Path       varchar(255) null,
    constraint Answers_ID_uindex
        unique (ID),
    constraint Answers_Questions_ID_fk
        foreign key (QuestionID) references Questions (ID)
);

create table Results
(
    QuizID     int         not null,
    UserID     int         not null,
    PlayerName varchar(16) not null,
    Score      int         null,
    constraint Results_Quizzes_ID_fk
        foreign key (QuizID) references Quizzes (ID),
    constraint Results_Users_ID_fk
        foreign key (UserID) references Users (ID)
);

