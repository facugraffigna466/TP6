# 🚀 Azure DevOps Deployment Guide

Este proyecto incluye un pipeline de Azure DevOps para deploy automático en Azure Web App.

## 📁 Archivos del Pipeline

### `azure-pipelines.yml`
- **Trigger**: Push a `main` y `develop`
- **Stages**: Build, Deploy, Notify
- **Deploy**: Solo en branch `main`

## 🛠️ Configuración Paso a Paso

### **PASO 1: Preparar Azure Web App**

1. **Crear Azure Web App:**
   ```bash
   # Usar Azure CLI
   az group create --name rg-simple-vite-react-express --location "East US"
   az webapp create --resource-group rg-simple-vite-react-express --plan myAppServicePlan --name tu-app-name --runtime "NODE|20-lts"
   ```

2. **Configurar variables de entorno:**
   ```bash
   az webapp config appsettings set --name tu-app-name --resource-group rg-simple-vite-react-express --settings NODE_ENV=production
   ```

### **PASO 2: Configurar Azure DevOps**

1. **Crear Service Connection:**
   - Ve a **Project Settings** → **Service connections**
   - **New service connection** → **Azure Resource Manager**
   - **Service principal (automatic)**
   - Selecciona tu suscripción
   - Dale nombre: `Azure-Subscription`
   - ✅ **Grant access permission to all pipelines**

2. **Crear Variables del Pipeline:**
   - Ve a **Pipelines** → **Library** → **Variable groups**
   - **+ Variable group**
   - Nombre: `Deployment-Variables`
   - Agregar variables:
     - `azureSubscription`: `Azure-Subscription`
     - `appName`: `tu-app-name`
     - `resourceGroupName`: `rg-simple-vite-react-express`

### **PASO 3: Crear el Pipeline**

1. **Crear Pipeline:**
   - Ve a **Pipelines** → **Pipelines**
   - **New pipeline**
   - **Azure Repos Git**
   - Selecciona tu repositorio
   - **Existing Azure Pipelines YAML file**
   - Selecciona `azure-pipelines.yml`

2. **Asociar Variable Group:**
   - En el pipeline, ve a **Edit**
   - **Variables** → **Variable groups**
   - **Link variable group**
   - Selecciona `Deployment-Variables`

### **PASO 4: Configurar Environment**

1. **Crear Environment:**
   - Ve a **Pipelines** → **Environments**
   - **New environment**
   - Nombre: `Production`
   - Tipo: `None`

2. **Configurar Approvals (Opcional):**
   - En el environment `Production`
   - **Approvals and checks**
   - **Approvals** → **Add**
   - Agregar usuarios que deben aprobar

### **PASO 5: Ejecutar el Pipeline**

1. **Primera Ejecución:**
   - Haz push a `main` o `develop`
   - El pipeline se ejecutará automáticamente

2. **Verificar Deploy:**
   - Ve a tu Azure Web App
   - URL: `https://tu-app-name.azurewebsites.net`

## 📊 Stages del Pipeline

### **🏗️ Build Stage**
- ✅ Setup Node.js 20.x
- ✅ Install dependencies (con --legacy-peer-deps)
- ✅ Run linting
- ✅ Run tests
- ✅ Security audit
- ✅ Build application
- ✅ Publish artifacts

### **🚀 Deploy Stage** (solo main)
- ✅ Download artifacts
- ✅ Extract deployment package
- ✅ Deploy to Azure Web App
- ✅ Configure app settings

### **📢 Notify Stage**
- ✅ Success/failure notifications
- ✅ Build information

## 🔧 Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `azureSubscription` | Service connection name | `Azure-Subscription` |
| `appName` | Azure Web App name | `mi-app-react-express` |
| `resourceGroupName` | Azure Resource Group | `rg-simple-vite-react-express` |

## 🚨 Troubleshooting

### **Error: Service connection not found**
- Verifica que el service connection existe
- Asegúrate de que tiene permisos de "Grant access permission to all pipelines"

### **Error: App not found**
- Verifica que `appName` es correcto
- Verifica que `resourceGroupName` es correcto

### **Error: Deploy failed**
- Verifica que la Web App está configurada para Node.js
- Revisa los logs de Azure Web App

### **Error: Tests failed**
- Ejecuta `npm run test:ci` localmente
- Verifica que todos los tests pasan

## 📈 Monitoreo

### **Azure DevOps:**
- **Pipelines** → Ver historial de builds
- **Environments** → Ver deployments

### **Azure Portal:**
- **App Service** → Ver logs y métricas
- **Application Insights** → Ver telemetría (opcional)

## 🎯 Comandos Útiles

```bash
# Ver logs de la Web App
az webapp log tail --name tu-app-name --resource-group rg-simple-vite-react-express

# Ver configuración de la Web App
az webapp show --name tu-app-name --resource-group rg-simple-vite-react-express

# Restart la Web App
az webapp restart --name tu-app-name --resource-group rg-simple-vite-react-express
```

## 🎉 ¡Listo!

Una vez configurado, cada push a `main` desplegará automáticamente tu aplicación a Azure Web App.

### **URLs:**
- **Frontend**: `https://tu-app-name.azurewebsites.net`
- **API**: `https://tu-app-name.azurewebsites.net/api/v1/health`

### **Próximos pasos:**
1. Configurar dominio personalizado (opcional)
2. Configurar SSL (automático con Azure)
3. Configurar Application Insights (opcional)
4. Configurar staging environment (opcional)
