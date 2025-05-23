/*
 Navicat Premium Dump SQL

 Source Server         : sql_server_1433
 Source Server Type    : SQL Server
 Source Server Version : 16004195 (16.00.4195)
 Source Host           : localhost:1433
 Source Catalog        : QLVT
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 16004195 (16.00.4195)
 File Encoding         : 65001

 Date: 23/05/2025 09:41:26
*/


-- ----------------------------
-- Table structure for Branch
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Branch]') AND type IN ('U'))
	DROP TABLE [dbo].[Branch]
GO

CREATE TABLE [dbo].[Branch] (
  [branchId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [address] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Branch] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Branch
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[Branch] ([branchId], [name], [address], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HCM', N'HCM', N'HCM', N'2025-05-20 03:24:44.2457230', N'2025-05-20 03:24:44.2457230', N'0', N'0', NULL)
GO

INSERT INTO [dbo].[Branch] ([branchId], [name], [address], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN', N'HANOI', N'HANOI', N'2025-05-20 03:24:37.6380553', N'2025-05-20 03:24:37.6380553', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Customer
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Customer]') AND type IN ('U'))
	DROP TABLE [dbo].[Customer]
GO

CREATE TABLE [dbo].[Customer] (
  [customerId] int  IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [address] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [phone] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [email] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [note] text COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Customer] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Customer
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Customer] ON
GO

INSERT INTO [dbo].[Customer] ([customerId], [name], [address], [phone], [email], [note], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'5', N'KH1', N'KH', N'KH', N'KH', N'KH', N'2025-05-20 10:28:42.0000000', N'2025-05-20 10:28:44.0000000', N'1', N'1', NULL)
GO

SET IDENTITY_INSERT [dbo].[Customer] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for ExportReceipt
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[ExportReceipt]') AND type IN ('U'))
	DROP TABLE [dbo].[ExportReceipt]
GO

CREATE TABLE [dbo].[ExportReceipt] (
  [exportId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [orderId] varchar(max) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [warehouseId] int  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[ExportReceipt] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of ExportReceipt
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[ExportReceipt] ([exportId], [orderId], [warehouseId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'TEST2', N'5', N'2025-05-22 03:37:34.0333226', N'2025-05-22 03:37:34.0333226', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for ExportReceiptDetail
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[ExportReceiptDetail]') AND type IN ('U'))
	DROP TABLE [dbo].[ExportReceiptDetail]
GO

CREATE TABLE [dbo].[ExportReceiptDetail] (
  [exportId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [productId] int  NOT NULL,
  [quantity] decimal(15,3)  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[ExportReceiptDetail] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of ExportReceiptDetail
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[ExportReceiptDetail] ([exportId], [productId], [quantity], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'6', N'6.000', N'2025-05-22 03:37:50.3012707', N'2025-05-22 03:37:50.3012707', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Identity
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Identity]') AND type IN ('U'))
	DROP TABLE [dbo].[Identity]
GO

CREATE TABLE [dbo].[Identity] (
  [branchId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [num] int DEFAULT 0 NOT NULL,
  [name] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[Identity] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Identity
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HCM', N'1', N'Export')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HCM', N'1', N'Import')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HCM', N'1', N'Order')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HCM', N'2', N'User')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HN', N'1', N'Export')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HN', N'1', N'Import')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HN', N'7', N'Order')
GO

INSERT INTO [dbo].[Identity] ([branchId], [num], [name]) VALUES (N'HN', N'1', N'User')
GO

COMMIT
GO


-- ----------------------------
-- Table structure for ImportReceipt
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[ImportReceipt]') AND type IN ('U'))
	DROP TABLE [dbo].[ImportReceipt]
GO

CREATE TABLE [dbo].[ImportReceipt] (
  [importId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [orderId] varchar(max) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [warehouseId] int  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[ImportReceipt] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of ImportReceipt
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[ImportReceipt] ([importId], [orderId], [warehouseId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'TEST1', N'5', N'2025-05-22 03:36:37.9305055', N'2025-05-22 03:36:37.9305055', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for ImportReceiptDetail
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[ImportReceiptDetail]') AND type IN ('U'))
	DROP TABLE [dbo].[ImportReceiptDetail]
GO

CREATE TABLE [dbo].[ImportReceiptDetail] (
  [importId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [productId] int  NOT NULL,
  [quantity] decimal(15,3)  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[ImportReceiptDetail] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of ImportReceiptDetail
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[ImportReceiptDetail] ([importId], [productId], [quantity], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'6', N'7.000', N'2025-05-22 03:37:59.3893566', N'2025-05-22 03:37:59.3893566', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Order
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Order]') AND type IN ('U'))
	DROP TABLE [dbo].[Order]
GO

CREATE TABLE [dbo].[Order] (
  [orderId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [type] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'Import' NOT NULL,
  [status] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'init' NOT NULL,
  [sourceWarehouseId] int  NULL,
  [destinationWarehouseId] int  NULL,
  [customerId] int  NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Order] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Order
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000004', N'import', N'init', N'5', NULL, N'5', N'2025-05-22 08:16:10.4718941', N'2025-05-22 08:16:10.4718941', N'HCM-1', N'HCM-1', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000005', N'import', N'init', N'5', NULL, N'5', N'2025-05-22 08:24:01.1971266', N'2025-05-22 08:24:01.1971266', N'HCM-1', N'HCM-1', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000006', N'export', N'init', NULL, N'6', N'5', N'2025-05-22 08:24:24.8208996', N'2025-05-22 15:51:03.0000000', N'HN-0', N'HN-0', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-1', N'import', N'init', N'5', NULL, N'5', N'2025-05-22 08:10:19.5153405', N'2025-05-22 08:10:19.5153405', N'HCM-1', N'HCM-1', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-3', N'import', N'init', N'5', NULL, N'5', N'2025-05-22 08:13:20.6805968', N'2025-05-22 08:13:20.6805968', N'HCM-1', N'HCM-1', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'import', N'completed', NULL, N'5', N'5', N'2025-05-22 03:35:15.6695947', N'2025-05-22 03:35:15.6695947', N'0', N'0', NULL)
GO

INSERT INTO [dbo].[Order] ([orderId], [type], [status], [sourceWarehouseId], [destinationWarehouseId], [customerId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST2', N'export', N'completed', N'5', NULL, N'5', N'2025-05-22 03:36:10.3817207', N'2025-05-22 03:36:10.3817207', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for OrderDetail
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderDetail]') AND type IN ('U'))
	DROP TABLE [dbo].[OrderDetail]
GO

CREATE TABLE [dbo].[OrderDetail] (
  [orderId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [productId] int  NOT NULL,
  [quantity] decimal(15,3)  NOT NULL,
  [price] decimal(15,3)  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[OrderDetail] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of OrderDetail
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000005', N'6', N'6.000', N'10.000', N'2025-05-22 08:24:01.2052473', N'2025-05-22 08:24:01.2052473', N'HCM-1', N'HCM-1', NULL)
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000006', N'6', N'7.000', N'10.000', N'2025-05-22 09:10:56.5454617', N'2025-05-22 09:10:56.5454617', N'HN-0', N'HN-0', NULL)
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0000000006', N'8', N'6.000', N'10.000', N'2025-05-22 09:10:56.5495228', N'2025-05-22 09:10:56.5495228', N'HN-0', N'HN-0', NULL)
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'6', N'56.000', N'100.000', N'2025-05-22 04:57:49.0393384', N'2025-05-22 04:57:49.0393384', N'0', N'0', NULL)
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST1', N'8', N'56.000', N'100.000', N'2025-05-22 06:42:52.0797235', N'2025-05-22 06:42:52.0797235', N'0', N'0', NULL)
GO

INSERT INTO [dbo].[OrderDetail] ([orderId], [productId], [quantity], [price], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'TEST2', N'6', N'52.000', N'19.000', N'2025-05-22 04:58:01.5359551', N'2025-05-22 04:58:01.5359551', N'0', N'0', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Product
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Product]') AND type IN ('U'))
	DROP TABLE [dbo].[Product]
GO

CREATE TABLE [dbo].[Product] (
  [productId] int  IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [unit] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Product] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Product
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Product] ON
GO

INSERT INTO [dbo].[Product] ([productId], [name], [unit], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'6', N'Apple1', N'KG', N'2025-05-22 03:19:51.3161417', N'2025-05-22 03:19:51.3161417', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[Product] ([productId], [name], [unit], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'8', N'Melon', N'KG', N'2025-05-22 06:43:54.3338029', N'2025-05-22 06:43:54.3338029', N'0', N'0', NULL)
GO

SET IDENTITY_INSERT [dbo].[Product] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Setting
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Setting]') AND type IN ('U'))
	DROP TABLE [dbo].[Setting]
GO

CREATE TABLE [dbo].[Setting] (
  [settingId] int  IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
  [section] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [key] text COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [value] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [isHidden] tinyint DEFAULT 0 NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Setting] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Setting
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Setting] ON
GO

SET IDENTITY_INSERT [dbo].[Setting] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for User
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type IN ('U'))
	DROP TABLE [dbo].[User]
GO

CREATE TABLE [dbo].[User] (
  [userId] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [password] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [address] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [phone] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [email] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [dob] date  NOT NULL,
  [role] int DEFAULT 3 NOT NULL,
  [branchId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[User] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of User
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'CN-HN123', N'$2b$10$iBybdXNwQLlCLgYkUzEXce1HZKVWJtrUY/pHGbZjFQNHoih2TSngW', N'admin', N'admin1', N'admin', N'admin', N'2025-05-20', N'3', N'HN', N'2025-05-20 03:24:09.3364964', N'2025-05-20 03:24:09.3364964', N'0', N'0', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HCM-0', N'$2b$10$eFM4dEcpithVCyKqRd/Lo.2F/o6qZedPNnFkcw/1gte7cIzLmMjS6', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HCM', N'2025-05-20 04:35:51.4669689', N'2025-05-20 04:35:51.4669689', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HCM-1', N'$2b$10$wNHFriO6UN47G9sgnpENWecz0FLVYty.r8ae1b0gTJk8WypB4BWKK', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HCM', N'2025-05-20 04:36:11.0385612', N'2025-05-20 04:36:11.0385612', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'HN-0', N'$2b$10$aSPhxL5OHM/0T2JMqszT2O/xt8Gsu9/POmKavEzyn4v3oI8tvPxYa', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HN', N'2025-05-20 04:36:23.0362664', N'2025-05-20 04:36:23.0362664', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'NV-HN-1747713856125-0101dfe2-6d6a-4294-9ca6-736f2c98c308', N'$2b$10$iBybdXNwQLlCLgYkUzEXce1HZKVWJtrUY/pHGbZjFQNHoih2TSngW', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HN', N'2025-05-20 04:04:16.1270279', N'2025-05-20 04:04:16.1270279', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'NV-HN-1747713960453-ac34cb21-f331-430d-8aab-dc6b69bc6756', N'$2b$10$iBybdXNwQLlCLgYkUzEXce1HZKVWJtrUY/pHGbZjFQNHoih2TSngW', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HN', N'2025-05-20 04:06:00.4534647', N'2025-05-20 04:06:00.4534647', N'CN-HN123', N'CN-HN123', NULL)
GO

INSERT INTO [dbo].[User] ([userId], [password], [name], [address], [phone], [email], [dob], [role], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'NV174771349806861b44443-8f30-414d-a59a-78cd14bebb79', N'$2b$10$iBybdXNwQLlCLgYkUzEXce1HZKVWJtrUY/pHGbZjFQNHoih2TSngW', N'tranquan', N'HN', N'+84868466696', N'trannhatquan1.2001@gmail.com', N'2024-11-06', N'2', N'HN', N'2025-05-20 03:58:18.0718241', N'2025-05-20 03:58:18.0718241', N'CN-HN123', N'CN-HN123', NULL)
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Warehouse
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Warehouse]') AND type IN ('U'))
	DROP TABLE [dbo].[Warehouse]
GO

CREATE TABLE [dbo].[Warehouse] (
  [warehouseId] int  IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [address] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [branchId] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [createdTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [updatedTime] datetime2(7) DEFAULT sysutcdatetime() NOT NULL,
  [createdBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [updatedBy] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT '0' NOT NULL,
  [deletedTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Warehouse] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Warehouse
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Warehouse] ON
GO

INSERT INTO [dbo].[Warehouse] ([warehouseId], [name], [address], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'5', N'HN1', N'HANOI', N'HN', N'2025-05-20 10:27:02.0000000', N'2025-05-20 10:27:04.0000000', N'1', N'1', NULL)
GO

INSERT INTO [dbo].[Warehouse] ([warehouseId], [name], [address], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'6', N'HN2', N'HANOI', N'HN', N'2025-05-20 10:27:02.0000000', N'2025-05-20 10:27:04.0000000', N'1', N'1', NULL)
GO

INSERT INTO [dbo].[Warehouse] ([warehouseId], [name], [address], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'7', N'HCM1', N'HCM', N'HCM', N'2025-05-20 10:27:02.0000000', N'2025-05-20 10:27:04.0000000', N'1', N'1', NULL)
GO

INSERT INTO [dbo].[Warehouse] ([warehouseId], [name], [address], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'8', N'HCM2', N'HCM', N'HCM', N'2025-05-20 10:27:02.0000000', N'2025-05-20 10:27:04.0000000', N'1', N'1', NULL)
GO

INSERT INTO [dbo].[Warehouse] ([warehouseId], [name], [address], [branchId], [createdTime], [updatedTime], [createdBy], [updatedBy], [deletedTime]) VALUES (N'1005', N'testupdate', N'HN', N'HN', N'2025-05-22 02:39:07.0948743', N'2025-05-22 02:39:07.0948743', N'CN-HN123', N'CN-HN123', N'2025-05-22 02:44:12.1366667')
GO

SET IDENTITY_INSERT [dbo].[Warehouse] OFF
GO

COMMIT
GO


-- ----------------------------
-- Primary Key structure for table Branch
-- ----------------------------
ALTER TABLE [dbo].[Branch] ADD CONSTRAINT [PK__Branch__751EBD5F44DB5675] PRIMARY KEY CLUSTERED ([branchId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Customer
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Customer]', RESEED, 1001)
GO


-- ----------------------------
-- Checks structure for table Customer
-- ----------------------------
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [repl_identity_range_00DDF08A_4B25_4DA0_8027_A3CAC9D4EF12] CHECK NOT FOR REPLICATION ([customerId]>(4) AND [customerId]<=(1004) OR [customerId]>(1004) AND [customerId]<=(2004))
GO


-- ----------------------------
-- Primary Key structure for table Customer
-- ----------------------------
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [PK__Customer__B611CB7DABAB5623] PRIMARY KEY CLUSTERED ([customerId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table ExportReceipt
-- ----------------------------
ALTER TABLE [dbo].[ExportReceipt] ADD CONSTRAINT [PK__ExportRe__4D92A931F684993B] PRIMARY KEY CLUSTERED ([exportId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Checks structure for table ExportReceiptDetail
-- ----------------------------
ALTER TABLE [dbo].[ExportReceiptDetail] ADD CONSTRAINT [CK__ExportRec__quant__0C85DE4D] CHECK ([quantity]>=(0))
GO


-- ----------------------------
-- Primary Key structure for table ExportReceiptDetail
-- ----------------------------
ALTER TABLE [dbo].[ExportReceiptDetail] ADD CONSTRAINT [PK_ExportReceiptDetail] PRIMARY KEY CLUSTERED ([exportId], [productId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Identity
-- ----------------------------
ALTER TABLE [dbo].[Identity] ADD CONSTRAINT [PK__UserIden__751EBD5F3EBDE3DB] PRIMARY KEY CLUSTERED ([branchId], [name])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table ImportReceipt
-- ----------------------------
ALTER TABLE [dbo].[ImportReceipt] ADD CONSTRAINT [PK__ImportRe__2CC5AB676371A1B5] PRIMARY KEY CLUSTERED ([importId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Checks structure for table ImportReceiptDetail
-- ----------------------------
ALTER TABLE [dbo].[ImportReceiptDetail] ADD CONSTRAINT [CK__ImportRec__quant__0D7A0286] CHECK ([quantity]>=(0))
GO


-- ----------------------------
-- Primary Key structure for table ImportReceiptDetail
-- ----------------------------
ALTER TABLE [dbo].[ImportReceiptDetail] ADD CONSTRAINT [PK_ImportReceiptDetail] PRIMARY KEY CLUSTERED ([importId], [productId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Order
-- ----------------------------
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [PK__Order__0809335D554985EC] PRIMARY KEY CLUSTERED ([orderId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Checks structure for table OrderDetail
-- ----------------------------
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [CK__OrderDeta__price__0E6E26BF] CHECK ([price]>=(0))
GO

ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [CK__OrderDeta__quant__0F624AF8] CHECK ([quantity]>=(0))
GO


-- ----------------------------
-- Primary Key structure for table OrderDetail
-- ----------------------------
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [PK_OrderDetail] PRIMARY KEY CLUSTERED ([orderId], [productId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Product
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Product]', RESEED, 1005)
GO


-- ----------------------------
-- Uniques structure for table Product
-- ----------------------------
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [UQ__Product__72E12F1BD0F813C0] UNIQUE NONCLUSTERED ([name] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Product
-- ----------------------------
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [PK__Product__2D10D16A2F6C94B5] PRIMARY KEY CLUSTERED ([productId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Setting
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Setting]', RESEED, 1)
GO


-- ----------------------------
-- Primary Key structure for table Setting
-- ----------------------------
ALTER TABLE [dbo].[Setting] ADD CONSTRAINT [PK__Setting__097EE23CF0A8582F] PRIMARY KEY CLUSTERED ([settingId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE [dbo].[User] ADD CONSTRAINT [PK__User__CB9A1CFF92E9B7B4] PRIMARY KEY CLUSTERED ([userId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Warehouse
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Warehouse]', RESEED, 1005)
GO


-- ----------------------------
-- Primary Key structure for table Warehouse
-- ----------------------------
ALTER TABLE [dbo].[Warehouse] ADD CONSTRAINT [PK__Warehous__102CD59784CE2C6A] PRIMARY KEY CLUSTERED ([warehouseId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO

