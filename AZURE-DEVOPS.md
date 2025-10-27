# 🚀 Azure DevOps Pipeline Configuration

Este proyecto incluye configuraciones completas de CI/CD para Azure DevOps.

## 📁 Archivos de Pipeline

### 1. `azure-pipelines.yml` - Pipeline Principal
- **Trigger**: Push a `main`, `develop`, feature branches
- **Stages**:
  - 🏗️ **Build**: Instalación, linting, build
  - 🧪 **Test**: Tests de backend y frontend
  - 🔒 **Security**: Auditoría de seguridad
  - 🚀 **Deploy**: Deploy a producción (solo main)
  - 📢 **Notify**: Notificaciones

## 🛠️ Configuración Paso a Paso en Azure DevOps

### **PASO 1: Preparar el Repositorio**

#### 1.1 Subir el código a Azure DevOps
```bash
# 1. Crear un nuevo proyecto en Azure DevOps
# 2. Inicializar el repositorio local
git init
git add .
git commit -m "Initial commit with Azure DevOps pipeline"

# 3. Conectar con Azure DevOps
git remote add origin https://dev.azure.com/[tu-organizacion]/[tu-proyecto]/_git/[tu-repositorio]
git push -u origin main
```

#### 1.2 Verificar que el archivo `azure-pipelines.yml` esté en la raíz
```bash
# El archivo debe estar en la raíz del proyecto
ls -la azure-pipelines.yml
```

### **PASO 2: Crear el Pipeline en Azure DevOps**

#### 2.1 Acceder a Azure DevOps
1. Ve a [https://dev.azure.com](https://dev.azure.com)
2. Selecciona tu organización
3. Selecciona tu proyecto

#### 2.2 Crear el Pipeline
1. **Pipelines** → **New Pipeline**
2. **Where is your code?** → **Azure Repos Git**
3. **Select a repository** → Selecciona tu repositorio
4. **Configure your pipeline** → **Existing Azure Pipelines YAML file**
5. **Select an existing YAML file** → Selecciona `azure-pipelines.yml`
6. **Review** → **Save and run**

### **PASO 3: Configurar Variables del Pipeline**

#### 3.1 Crear Variable Group
1. **Pipelines** → **Library** → **+ Variable group**
2. Nombre: `Pipeline-Variables`
3. Agregar las siguientes variables:

| Variable | Valor | Descripción | Secret |
|----------|-------|-------------|--------|
| `nodeVersion` | `20.x` | Versión de Node.js | ❌ |
| `azureSubscription` | `Your-Azure-Subscription` | Nombre de la conexión a Azure | ❌ |
| `webAppName` | `your-app-name` | Nombre de la Web App | ❌ |
| `resourceGroupName` | `your-resource-group` | Grupo de recursos de Azure | ❌ |
| `slackWebhook` | `https://hooks.slack.com/...` | Webhook de Slack (opcional) | ✅ |
| `teamsWebhook` | `https://outlook.office.com/...` | Webhook de Teams (opcional) | ✅ |

#### 3.2 Asociar Variable Group al Pipeline
1. **Pipelines** → Selecciona tu pipeline
2. **Edit** → **Variables** → **Variable groups**
3. **+ Add** → Selecciona `Pipeline-Variables`

### **PASO 4: Configurar Service Connections**

#### 4.1 Azure Resource Manager Connection
1. **Project Settings** → **Service connections** → **New service connection**
2. **Azure Resource Manager** → **Service principal (automatic)**
3. **Scope level** → **Subscription**
4. **Subscription** → Selecciona tu suscripción
5. **Resource group** → Selecciona tu grupo de recursos
6. **Service connection name** → `Your-Azure-Subscription`
7. **Grant access permission to all pipelines** → ✅
8. **Create**

#### 4.2 GitHub Connection (Opcional)
1. **Project Settings** → **Service connections** → **New service connection**
2. **GitHub** → **Grant authorization**
3. **Service connection name** → `Your-GitHub-Connection`
4. **Grant access permission to all pipelines** → ✅
5. **Create**

### **PASO 5: Configurar Environments**

#### 5.1 Crear Environment de Producción
1. **Pipelines** → **Environments** → **New environment**
2. **Name** → `Production`
3. **Description** → `Environment for production deployments`
4. **Create**

#### 5.2 Configurar Approvals (Opcional)
1. Selecciona el environment `Production`
2. **Approvals and checks** → **+**
3. **Approvals** → **Next**
4. **Approvers** → Agrega los usuarios que deben aprobar
5. **Create**

### **PASO 6: Configurar el Pipeline YAML**

#### 6.1 Editar el archivo `azure-pipelines.yml`
```yaml
# Reemplazar estas variables con tus valores reales:
variables:
  azureSubscription: 'Your-Azure-Subscription'  # ← Cambiar por tu service connection
  webAppName: 'your-app-name'                   # ← Cambiar por tu app name
  resourceGroupName: 'your-resource-group'      # ← Cambiar por tu resource group
```

#### 6.2 Configurar el Deploy (Opcional)
Si quieres deploy automático, descomenta y configura la sección de deploy:

```yaml
# En la sección Deploy, reemplazar:
- task: AzureWebApp@1
  inputs:
    azureSubscription: 'Your-Azure-Subscription'  # ← Tu service connection
    appName: 'your-app-name'                      # ← Tu app name
    package: '$(System.DefaultWorkingDirectory)/deploy'
    deploymentMethod: 'zipDeploy'
```

### **PASO 7: Ejecutar el Pipeline**

#### 7.1 Primera Ejecución
1. **Pipelines** → Selecciona tu pipeline
2. **Run pipeline** → **Run**
3. Monitorea la ejecución en tiempo real

#### 7.2 Verificar Resultados
1. **Tests** → Ver resultados de tests
2. **Code Coverage** → Ver reportes de cobertura
3. **Artifacts** → Ver artifacts generados
4. **Logs** → Ver logs detallados

### **PASO 8: Configurar Notificaciones (Opcional)**

#### 8.1 Slack Notifications
1. Crear un webhook en Slack
2. Agregar la URL del webhook a las variables
3. El pipeline enviará notificaciones automáticamente

#### 8.2 Teams Notifications
1. Crear un webhook en Teams
2. Agregar la URL del webhook a las variables
3. El pipeline enviará notificaciones automáticamente

### **PASO 9: Configurar Triggers**

#### 9.1 Configurar Triggers Automáticos
1. **Pipelines** → Selecciona tu pipeline
2. **Edit** → **Triggers**
3. **Continuous integration** → ✅
4. **Branch filters** → Agregar `main`, `develop`, `feature/*`
5. **Save**

#### 9.2 Configurar Pull Request Triggers
1. **Pipelines** → Selecciona tu pipeline
2. **Edit** → **Triggers**
3. **Pull request validation** → ✅
4. **Branch filters** → Agregar `main`, `develop`
5. **Save**

### **PASO 10: Monitoreo y Mantenimiento**

#### 10.1 Dashboard de Pipeline
1. **Pipelines** → **Analytics**
2. Ver métricas de ejecución
3. Identificar tendencias y problemas

#### 10.2 Logs y Debugging
1. **Pipelines** → Selecciona una ejecución
2. **Logs** → Ver logs detallados
3. **Artifacts** → Descargar artifacts
4. **Tests** → Ver resultados de tests

#### 10.3 Mantenimiento Regular
1. **Pipelines** → **Library** → **Variable groups**
2. Actualizar variables cuando sea necesario
3. **Pipelines** → **Environments**
4. Verificar que los environments estén funcionando

## 🎯 Scripts de NPM Configurados

```json
{
  "ci:backend": "npm run test:services",
  "ci:frontend": "npm test client/",
  "ci:lint": "npm run lint && npm run format:check",
  "ci:build": "npm run build",
  "ci:security": "npm audit --audit-level=moderate"
}
```

## 📊 Reportes de Cobertura

Los pipelines generan reportes de cobertura que se pueden ver en:
- Azure DevOps > Pipelines > [Pipeline Name] > Code Coverage
- Reportes detallados en formato HTML

## 🔔 Notificaciones

### Slack (Opcional)
```yaml
- task: SlackNotification@1
  inputs:
    webhook: '$(slackWebhook)'
    message: 'Pipeline $(Build.BuildNumber) completed!'
```

### Teams (Opcional)
```yaml
- task: TeamsNotification@1
  inputs:
    webhook: '$(teamsWebhook)'
    message: 'Pipeline $(Build.BuildNumber) completed!'
```

## 🚀 Deploy a Azure

### Azure Web App
```yaml
- task: AzureWebApp@1
  inputs:
    azureSubscription: '$(azureSubscription)'
    appName: '$(webAppName)'
    package: '$(System.DefaultWorkingDirectory)/deploy'
    deploymentMethod: 'zipDeploy'
```

### Azure Container Instances
```yaml
- task: AzureCLI@2
  inputs:
    azureSubscription: '$(azureSubscription)'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az container create \
        --resource-group $(resourceGroupName) \
        --name $(webAppName) \
        --image your-registry.azurecr.io/your-app:latest
```

## 🔧 Troubleshooting Detallado

### **Error: "npm ci failed"**
```bash
# Causa: Dependencias no resueltas o package-lock.json corrupto
# Solución:
npm install --legacy-peer-deps
npm audit fix
git add package-lock.json
git commit -m "Fix package-lock.json"
git push
```

### **Error: "Tests failed"**
```bash
# Causa: Tests fallando en el pipeline
# Solución:
# 1. Ejecutar tests localmente
npm test
npm run ci:backend
npm run ci:frontend

# 2. Verificar que los mocks estén funcionando
npm run test:watch

# 3. Revisar logs del pipeline para detalles específicos
```

### **Error: "Build failed"**
```bash
# Causa: Error en el proceso de build
# Solución:
# 1. Verificar que el build funciona localmente
npm run ci:build

# 2. Verificar que todas las dependencias estén instaladas
npm install --legacy-peer-deps

# 3. Verificar que no hay errores de TypeScript/ESLint
npm run lint
npm run format:check
```

### **Error: "Service connection not found"**
```bash
# Causa: Service connection no configurado o mal configurado
# Solución:
# 1. Verificar que el service connection existe
# 2. Verificar que el nombre coincide exactamente
# 3. Verificar que tiene permisos para todos los pipelines
```

### **Error: "Environment not found"**
```bash
# Causa: Environment no creado o mal configurado
# Solución:
# 1. Crear el environment en Azure DevOps
# 2. Verificar que el nombre coincide exactamente
# 3. Verificar que tiene permisos para el pipeline
```

### **Error: "Variable not found"**
```bash
# Causa: Variable no definida o mal configurada
# Solución:
# 1. Verificar que la variable existe en Variable Groups
# 2. Verificar que el Variable Group está asociado al pipeline
# 3. Verificar que el nombre de la variable coincide exactamente
```

## 📈 Métricas y Monitoreo

### **Dashboard de Pipeline**
- **Tiempo de ejecución**: Monitorear en Azure DevOps > Pipelines > Analytics
- **Tasa de éxito**: Dashboard de Azure DevOps > Pipelines > Analytics
- **Cobertura de código**: Reportes de cobertura en cada ejecución
- **Vulnerabilidades**: Reportes de seguridad en cada ejecución

### **Alertas y Notificaciones**
- **Slack**: Notificaciones automáticas de éxito/fallo
- **Teams**: Notificaciones automáticas de éxito/fallo
- **Email**: Notificaciones por defecto de Azure DevOps

## 🎯 Mejores Prácticas

### **1. Organización del Código**
```bash
# Mantener el código organizado
src/
├── client/          # Frontend React
├── server/          # Backend Express
├── tests/           # Tests de integración (opcional)
└── docs/            # Documentación
```

### **2. Commits y Branches**
```bash
# Usar convenciones de commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in authentication"
git commit -m "test: add unit tests for user service"

# Usar branches descriptivos
git checkout -b feature/user-authentication
git checkout -b fix/login-bug
git checkout -b test/add-coverage
```

### **3. Variables y Secretos**
```bash
# Nunca hardcodear secretos en el código
# Usar Variable Groups para secretos
# Usar variables para configuraciones no sensibles
```

### **4. Monitoreo Continuo**
```bash
# Revisar logs regularmente
# Monitorear métricas de performance
# Actualizar dependencias regularmente
# Mantener tests actualizados
```

## 🚀 Comandos Útiles

### **Ejecutar Pipeline Localmente**
```bash
# Simular el pipeline localmente
npm run ci:lint
npm run ci:backend
npm run ci:frontend
npm run ci:build
npm run ci:security
```

### **Debug del Pipeline**
```bash
# Ver logs detallados
# Azure DevOps > Pipelines > [Pipeline] > [Run] > Logs

# Descargar artifacts
# Azure DevOps > Pipelines > [Pipeline] > [Run] > Artifacts
```

### **Actualizar Pipeline**
```bash
# Editar azure-pipelines.yml
# Commit y push
git add azure-pipelines.yml
git commit -m "feat: update pipeline configuration"
git push
```

## 🎉 ¡Listo!

Una vez configurado, el pipeline se ejecutará automáticamente en cada push y pull request, proporcionando:

- ✅ **Validación automática de código**
- 🧪 **Ejecución de tests**
- 🔒 **Auditoría de seguridad**
- 🚀 **Deploy automático a producción**
- 📊 **Reportes de cobertura y calidad**
- 🔔 **Notificaciones automáticas**
- 📈 **Métricas y monitoreo continuo**

### **Próximos Pasos:**
1. **Configurar el pipeline** siguiendo los pasos detallados
2. **Ejecutar la primera vez** y verificar que todo funciona
3. **Configurar notificaciones** (opcional)
4. **Configurar deploy** (opcional)
5. **Monitorear y mantener** el pipeline regularmente
