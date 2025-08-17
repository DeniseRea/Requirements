# Page snapshot

```yaml
- banner:
  - heading " Panel del Auditor FAE-Sign" [level=1]
  - text: Auditor
  - button " Cerrar Sesión"
- navigation:
  - button " Logs de Auditoría"
  - button " Estadísticas del Sistema"
- main:
  - heading " Logs del Sistema" [level=2]
  - button " Exportar"
  - table:
    - rowgroup:
      - row "Timestamp Usuario Acción Detalles IP Criticidad":
        - cell "Timestamp"
        - cell "Usuario"
        - cell "Acción"
        - cell "Detalles"
        - cell "IP"
        - cell "Criticidad"
    - rowgroup:
      - row "2025-07-20 14:45:00 carlos.lopez@fae.mil.ec AUDIT_LOG_VIEWED Revisión de logs del sistema 192.168.1.101 low":
        - cell "2025-07-20 14:45:00"
        - cell "carlos.lopez@fae.mil.ec"
        - cell "AUDIT_LOG_VIEWED"
        - cell "Revisión de logs del sistema"
        - cell "192.168.1.101"
        - cell "low"
      - row "2025-07-19 09:30:00 carlos.lopez@fae.mil.ec REPORT_GENERATED Generó reporte de seguridad 192.168.1.101 medium":
        - cell "2025-07-19 09:30:00"
        - cell "carlos.lopez@fae.mil.ec"
        - cell "REPORT_GENERATED"
        - cell "Generó reporte de seguridad"
        - cell "192.168.1.101"
        - cell "medium"
```