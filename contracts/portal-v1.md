openapi: 3.1.0
info:
title: Employee Portal API
version: 1.0.0
description: >
v1 — Portal karyawan (append-only). User hanya bisa menambah data untuk "hari ini".
Aturan: wajib sudah check-in; terkunci setelah checkout atau cut-off (Asia/Jakarta).

servers:

- url: https://api.example.com

security:

- bearerAuth: []

tags:

- name: Portal
  description: Endpoints untuk karyawan (self-service)

paths:
/v1/portal/today:
get:
tags: [Portal]
summary: Status hari ini (absen, kegiatan, lembur)
operationId: getToday
responses:
"200":
description: OK
content:
application/json:
schema: { $ref: "#/components/schemas/TodayResponse" }
"401": { $ref: "#/components/responses/Unauthorized" }

/v1/portal/check-in:
post:
tags: [Portal]
summary: Check-in (absen masuk) hari ini
operationId: postCheckIn
responses:
"201":
description: Checked-in
content:
application/json:
schema: { $ref: "#/components/schemas/AttendanceStatus" }
"401": { $ref: "#/components/responses/Unauthorized" }
"409":
description: Conflict (sudah check-in)
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }
"422":
description: Di luar window yang diizinkan
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }

/v1/portal/check-out:
post:
tags: [Portal]
summary: Check-out (absen pulang) hari ini
operationId: postCheckOut
responses:
"201":
description: Checked-out
content:
application/json:
schema: { $ref: "#/components/schemas/AttendanceStatus" }
"401": { $ref: "#/components/responses/Unauthorized" }
"409":
description: Conflict (belum check-in / sudah check-out)
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }
"422":
description: Di luar window yang diizinkan
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }

/v1/portal/activity:
post:
tags: [Portal]
summary: Tambah kegiatan (tanpa jam per item, append-only)
operationId: postActivity
parameters: - $ref: "#/components/parameters/IdempotencyKey"
requestBody:
required: true
content:
application/json:
schema: { $ref: "#/components/schemas/ActivityCreateRequest" }
responses:
"201":
description: Created
content:
application/json:
schema: { $ref: "#/components/schemas/ActivityItem" }
"401": { $ref: "#/components/responses/Unauthorized" }
"403":
description: Forbidden (belum check-in / hari terkunci)
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }
"422":
description: Validation error
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }

/v1/portal/overtime:
post:
tags: [Portal]
summary: Tambah lembur (append-only)
operationId: postOvertime
parameters: - $ref: "#/components/parameters/IdempotencyKey"
requestBody:
required: true
content:
application/json:
schema: { $ref: "#/components/schemas/OvertimeCreateRequest" }
responses:
"201":
description: Created
content:
application/json:
schema: { $ref: "#/components/schemas/OvertimeItem" }
"401": { $ref: "#/components/responses/Unauthorized" }
"403":
description: Forbidden (belum check-in / hari terkunci)
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }
"422":
description: Validation error
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }

components:
securitySchemes:
bearerAuth:
type: http
scheme: bearer
bearerFormat: JWT

parameters:
IdempotencyKey:
name: Idempotency-Key
in: header
required: false
description: Kunci unik untuk mencegah duplikasi create.
schema: { type: string, minLength: 1, maxLength: 255 }

responses:
Unauthorized:
description: Unauthorized
content:
application/json:
schema: { $ref: "#/components/schemas/Error" }

schemas:
TodayResponse:
type: object
required: [date, timezone, attendance, activities, overtimes]
properties:
date:
{
type: string,
format: date,
description: Tanggal lokal (YYYY-MM-DD).,
}
timezone: { type: string, example: Asia/Jakarta }
attendance: { $ref: "#/components/schemas/AttendanceStatus" }
activities:
type: array
items: { $ref: "#/components/schemas/ActivityItem" }
overtimes:
type: array
items: { $ref: "#/components/schemas/OvertimeItem" }

    AttendanceStatus:
      type: object
      required: [checkInAt, checkOutAt, workDurationMinutes, overtimeMinutes]
      properties:
        checkInAt: { type: string, format: date-time, nullable: true }
        checkOutAt: { type: string, format: date-time, nullable: true }
        workDurationMinutes: { type: integer, minimum: 0 }
        overtimeMinutes: { type: integer, minimum: 0 }

    ActivityCreateRequest:
      type: object
      additionalProperties: false
      required: [category, description]
      properties:
        category: { $ref: "#/components/schemas/ActivityCategory" }
        description: { type: string, minLength: 3, maxLength: 256 }
        qty: { type: integer, minimum: 0, nullable: true }
        attachments:
          type: array
          items: { $ref: "#/components/schemas/Attachment" }
          maxItems: 5
          nullable: true

    ActivityItem:
      type: object
      required: [id, date, category, description, createdAt]
      properties:
        id: { type: string, format: uuid }
        date: { type: string, format: date }
        category: { $ref: "#/components/schemas/ActivityCategory" }
        description: { type: string }
        qty: { type: integer, nullable: true }
        attachments:
          type: array
          items: { $ref: "#/components/schemas/Attachment" }
          default: []
        createdAt: { type: string, format: date-time }

    ActivityCategory:
      type: string
      enum: [CNC_SETUP, QC, PURCHASING, MAINTENANCE, OTHER]

    OvertimeCreateRequest:
      type: object
      additionalProperties: false
      required: [durationMinutes]
      properties:
        durationMinutes: { type: integer, minimum: 15 }
        description:
          { type: string, minLength: 0, maxLength: 256, nullable: true }

    OvertimeItem:
      type: object
      required: [id, date, durationMinutes, createdAt]
      properties:
        id: { type: string, format: uuid }
        date: { type: string, format: date }
        durationMinutes: { type: integer, minimum: 0 }
        description: { type: string, nullable: true }
        createdAt: { type: string, format: date-time }

    Attachment:
      type: object
      required: [url, filename]
      properties:
        url: { type: string, format: uri }
        filename: { type: string }

    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
          enum:
            [
              AUTH_REQUIRED,
              FORBIDDEN,
              NOT_CHECKED_IN,
              DAY_LOCKED,
              VALIDATION_ERROR,
              CONFLICT,
              RATE_LIMITED,
              INTERNAL_ERROR,
            ]
        message: { type: string }
        details: { type: object, nullable: true }
