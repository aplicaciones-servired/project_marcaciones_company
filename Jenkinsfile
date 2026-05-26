def parseEnvFileContent(String content) {
  def envVars = [:]

  content.readLines().each { rawLine ->
    def line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      return
    }

    if (line.startsWith('export ')) {
      line = line.substring(7).trim()
    }

    def separatorIndex = line.indexOf('=')
    if (separatorIndex < 1) {
      return
    }

    def key = line.substring(0, separatorIndex).trim()
    def value = line.substring(separatorIndex + 1)
    envVars[key] = value
  }

  return envVars
}

def frontendEnv = [:]
def backendEnv = [:]

pipeline {
  agent any
    
  tools { nodejs 'node-v22' }

  environment { 
    ENV_MARCACION_CLIENT = credentials('ENV_MARCACION_CLIENT')
    ENV_MARCACION_API = credentials('ENV_MARCACION_API')
  }
    
  stages {
    stage('Load env vars') {
      steps {
        script {
          frontendEnv = parseEnvFileContent(readFile(ENV_MARCACION_CLIENT))
          backendEnv = parseEnvFileContent(readFile(ENV_MARCACION_API))
        }
      }
    }

    stage('Install dependencies') {
      steps {
        script {
          dir('frontend') {
            sh 'pnpm install'
          }
        }
      }
    }

    stage('Build client') {
      steps {
        script {
          withEnv(frontendEnv.collect { key, value -> "${key}=${value}" }) {
            dir('frontend') {
              sh 'pnpm build'
            }
          }
        }
      }
    }

    stage('down docker compose'){
      steps {
        script { sh 'docker compose down' }
      }
    }

    stage('delete images if exist') {
      steps{
        script {
          def images = 'api-marca-v1.0'
          if (sh(script: "docker images -q ${images}", returnStdout: true).trim()) {
            sh "docker rmi ${images}"
          } else {
            echo "Image ${images} does not exist."
            echo "continuing..."
          }
        }
      }
    }

    stage('run docker compose'){
        steps {
          script {
            withEnv(backendEnv.collect { key, value -> "${key}=${value}" }) {
              sh 'docker compose up -d'
            }
          }
        }
      }
    }
}
