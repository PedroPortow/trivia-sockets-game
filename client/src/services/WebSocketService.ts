class WebSocketService {
  private socket: WebSocket | null = null
  private isOpen = false
  private url: string
  private connectPromise: Promise<void> | null = null
  private DEFAULT_URL = 'ws://10.15.114.89:8765'

  constructor(url?: string) {
    this.url = url || this.DEFAULT_URL
  }

  public connect(customUrl?: string): Promise<void> {
    const target = customUrl || this.url

    this.connectPromise = new Promise((resolve, reject) => {
      this.socket = new WebSocket(target)

      this.socket.onopen = () => {
        this.isOpen = true
        resolve()
      }

      this.socket.onerror = () => {
        this.cleanup()
        reject(new Error('erro na conexao'))
      }

      this.socket.onclose = () => {
        this.cleanup()
      }
    })

    return this.connectPromise
  }

  public isConnected(): boolean {
    return this.isOpen
  }

  public send(data: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('deu ruim n ta aberta conexão viajou')
    }

    this.socket.send(data)
  }

  public getSocket() {
    return this.socket
  }

  public close() {
    if (this.socket) this.socket.close()
  }

  private cleanup() {
    this.isOpen = false
    this.connectPromise = null
  }
}

const websocketService = new WebSocketService()

export default websocketService
export { WebSocketService }
