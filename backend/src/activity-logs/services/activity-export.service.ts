import { Injectable, Logger, StreamableFile } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ActivityLog } from "../entities/activity-log.entity"
import { ExportFormat } from "../dto/export-activity-logs.dto"
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto"
import { createObjectCsvStringifier } from "csv-writer"
import * as ExcelJS from "exceljs"
import { Readable } from "stream"

@Injectable()
export class ActivityExportService {
  private readonly logger = new Logger(ActivityExportService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async exportLogs(
    queryParams: QueryActivityLogsDto,
    format: ExportFormat,
  ): Promise<{ data: StreamableFile; filename: string; contentType: string }> {
    // Build query based on filters
    const query = this.buildQuery(queryParams)

    // Execute query
    const logs = await query.getMany()

    // Format data based on export format
    switch (format) {
      case ExportFormat.CSV:
        return this.exportToCsv(logs)
      case ExportFormat.JSON:
        return this.exportToJson(logs)
      case ExportFormat.EXCEL:
        return this.exportToExcel(logs)
      default:
        return this.exportToCsv(logs)
    }
  }

  private buildQuery(queryParams: QueryActivityLogsDto) {
    const {
      userId,
      userIds,
      action,
      actions,
      category,
      categories,
      severity,
      severities,
      resourceType,
      resourceId,
      ipAddress,
      sessionId,
      requestId,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "DESC",
      includeAnonymized = false,
      searchTerm,
    } = queryParams

    let query = this.activityLogRepository.createQueryBuilder("log")

    // Apply filters
    if (userId) {
      query = query.andWhere("log.userId = :userId", { userId })
    }

    if (userIds && userIds.length > 0) {
      query = query.andWhere("log.userId IN (:...userIds)", { userIds })
    }

    if (action) {
      query = query.andWhere("log.action = :action", { action })
    }

    if (actions && actions.length > 0) {
      query = query.andWhere("log.action IN (:...actions)", { actions })
    }

    if (category) {
      query = query.andWhere("log.category = :category", { category })
    }

    if (categories && categories.length > 0) {
      query = query.andWhere("log.category IN (:...categories)", { categories })
    }

    if (severity) {
      query = query.andWhere("log.severity = :severity", { severity })
    }

    if (severities && severities.length > 0) {
      query = query.andWhere("log.severity IN (:...severities)", { severities })
    }

    if (resourceType) {
      query = query.andWhere("log.resourceType = :resourceType", { resourceType })
    }

    if (resourceId) {
      query = query.andWhere("log.resourceId = :resourceId", { resourceId })
    }

    if (ipAddress) {
      query = query.andWhere("log.ipAddress = :ipAddress", { ipAddress })
    }

    if (sessionId) {
      query = query.andWhere("log.sessionId = :sessionId", { sessionId })
    }

    if (requestId) {
      query = query.andWhere("log.requestId = :requestId", { requestId })
    }

    if (startDate) {
      query = query.andWhere("log.createdAt >= :startDate", { startDate: new Date(startDate) })
    }

    if (endDate) {
      query = query.andWhere("log.createdAt <= :endDate", { endDate: new Date(endDate) })
    }

    if (!includeAnonymized) {
      query = query.andWhere("log.isAnonymized = :isAnonymized", { isAnonymized: false })
    }

    if (searchTerm) {
      query = query.andWhere(
        "(log.action ILIKE :searchTerm OR log.userId::text ILIKE :searchTerm OR log.ipAddress ILIKE :searchTerm OR log.metadata::text ILIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` },
      )
    }

    // Apply sorting
    query = query.orderBy(`log.${sortBy}`, sortOrder as "ASC" | "DESC")

    return query
  }

  private async exportToCsv(
    logs: ActivityLog[],
  ): Promise<{ data: StreamableFile; filename: string; contentType: string }> {
    const headers = [
      { id: "id", title: "ID" },
      { id: "userId", title: "User ID" },
      { id: "action", title: "Action" },
      { id: "category", title: "Category" },
      { id: "severity", title: "Severity" },
      { id: "resourceType", title: "Resource Type" },
      { id: "resourceId", title: "Resource ID" },
      { id: "ipAddress", title: "IP Address" },
      { id: "userAgent", title: "User Agent" },
      { id: "sessionId", title: "Session ID" },
      { id: "requestId", title: "Request ID" },
      { id: "requestPath", title: "Request Path" },
      { id: "requestMethod", title: "Request Method" },
      { id: "statusCode", title: "Status Code" },
      { id: "duration", title: "Duration (ms)" },
      { id: "geoLocation", title: "Geo Location" },
      { id: "metadata", title: "Metadata" },
      { id: "createdAt", title: "Created At" },
    ]

    const csvStringifier = createObjectCsvStringifier({
      header: headers,
    })

    const records = logs.map((log) => ({
      id: log.id,
      userId: log.userId || "",
      action: log.action,
      category: log.category,
      severity: log.severity,
      resourceType: log.resourceType || "",
      resourceId: log.resourceId || "",
      ipAddress: log.ipAddress || "",
      userAgent: log.userAgent || "",
      sessionId: log.sessionId || "",
      requestId: log.requestId || "",
      requestPath: log.requestPath || "",
      requestMethod: log.requestMethod || "",
      statusCode: log.statusCode || "",
      duration: log.duration || "",
      geoLocation: log.geoLocation || "",
      metadata: JSON.stringify(log.metadata),
      createdAt: log.createdAt.toISOString(),
    }))

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records)
    const buffer = Buffer.from(csvContent)
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    const filename = `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`

    return {
      data: new StreamableFile(stream),
      filename,
      contentType: "text/csv",
    }
  }

  private async exportToJson(
    logs: ActivityLog[],
  ): Promise<{ data: StreamableFile; filename: string; contentType: string }> {
    const jsonContent = JSON.stringify(logs, null, 2)
    const buffer = Buffer.from(jsonContent)
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    const filename = `activity_logs_${new Date().toISOString().slice(0, 10)}.json`

    return {
      data: new StreamableFile(stream),
      filename,
      contentType: "application/json",
    }
  }

  private async exportToExcel(
    logs: ActivityLog[],
  ): Promise<{ data: StreamableFile; filename: string; contentType: string }> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Activity Logs")

    worksheet.columns = [
      { header: "ID", key: "id", width: 36 },
      { header: "User ID", key: "userId", width: 36 },
      { header: "Action", key: "action", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "Severity", key: "severity", width: 10 },
      { header: "Resource Type", key: "resourceType", width: 15 },
      { header: "Resource ID", key: "resourceId", width: 36 },
      { header: "IP Address", key: "ipAddress", width: 15 },
      { header: "User Agent", key: "userAgent", width: 30 },
      { header: "Session ID", key: "sessionId", width: 36 },
      { header: "Request ID", key: "requestId", width: 36 },
      { header: "Request Path", key: "requestPath", width: 30 },
      { header: "Request Method", key: "requestMethod", width: 10 },
      { header: "Status Code", key: "statusCode", width: 10 },
      { header: "Duration (ms)", key: "duration", width: 12 },
      { header: "Geo Location", key: "geoLocation", width: 20 },
      { header: "Metadata", key: "metadata", width: 50 },
      { header: "Created At", key: "createdAt", width: 20 },
    ]

    logs.forEach((log) => {
      worksheet.addRow({
        id: log.id,
        userId: log.userId || "",
        action: log.action,
        category: log.category,
        severity: log.severity,
        resourceType: log.resourceType || "",
        resourceId: log.resourceId || "",
        ipAddress: log.ipAddress || "",
        userAgent: log.userAgent || "",
        sessionId: log.sessionId || "",
        requestId: log.requestId || "",
        requestPath: log.requestPath || "",
        requestMethod: log.requestMethod || "",
        statusCode: log.statusCode || "",
        duration: log.duration || "",
        geoLocation: log.geoLocation || "",
        metadata: JSON.stringify(log.metadata),
        createdAt: log.createdAt.toISOString(),
      })
    })

    // Style the header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    const filename = `activity_logs_${new Date().toISOString().slice(0, 10)}.xlsx`

    return {
      data: new StreamableFile(stream),
      filename,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  }
}

