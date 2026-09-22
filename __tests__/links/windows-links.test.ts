import { AbstractLinks } from '../../src/links/links'
import { SemVer } from 'semver'
import { WindowsLinks } from '../../src/links/windows-links'
import { jest } from '@jest/globals'
import os from 'os'

test.concurrent('Windows Cuda versions in descending order', async () => {
  const wLinks: AbstractLinks = WindowsLinks.Instance
  const versions = wLinks.getAvailableLocalCudaVersions()
  for (let i = 0; i < versions.length - 1; i++) {
    const versionA: SemVer = versions[i]
    const versionB: SemVer = versions[i + 1]
    expect(versionA.compare(versionB)).toBe(1) // A should be greater than B
  }
})

test('Windows Cuda version to URL map contains valid URLs', async () => {
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    for (const version of WindowsLinks.Instance.getAvailableLocalCudaVersions()) {
      const url: URL =
        await WindowsLinks.Instance.getLocalURLFromCudaVersion(version)
      expect(url).toBeInstanceOf(URL)
    }
  } finally {
    x86Spy.mockRestore()
  }
})

test.concurrent('There is at least windows 1 version url pair', async () => {
  expect(
    WindowsLinks.Instance.getAvailableLocalCudaVersions().length
  ).toBeGreaterThanOrEqual(1)
})

test.concurrent(
  'Windows Cuda network versions in descending order',
  async () => {
    const wLinks = WindowsLinks.Instance
    const versions = wLinks.getAvailableNetworkCudaVersions()
    for (let i = 0; i < versions.length - 1; i++) {
      const versionA: SemVer = versions[i]
      const versionB: SemVer = versions[i + 1]
      expect(versionA.compare(versionB)).toBe(1) // A should be greater than B
    }
  }
)

test('Windows network Cuda version to URL map contains valid URLs', async () => {
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    for (const version of WindowsLinks.Instance.getAvailableNetworkCudaVersions()) {
      const url: URL =
        await WindowsLinks.Instance.getNetworkURLFromCudaVersion(version)
      expect(url).toBeInstanceOf(URL)
    }
  } finally {
    x86Spy.mockRestore()
  }
})

test.concurrent(
  'There is at least windows network 1 version url pair',
  async () => {
    expect(
      WindowsLinks.Instance.getAvailableNetworkCudaVersions().length
    ).toBeGreaterThanOrEqual(1)
  }
)

test('Local Windows links should start with https://developer.(.download.)nvidia.com and end with .exe', async () => {
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    const versions = WindowsLinks.Instance.getAvailableLocalCudaVersions()
    const filteredVersions = versions.filter((version) => {
      return (
        version.version !== '10.0.130' &&
        version.version !== '9.2.148' &&
        version.version !== '8.0.61'
      )
    })
    for (const version of filteredVersions) {
      const url: URL =
        await WindowsLinks.Instance.getLocalURLFromCudaVersion(version)
      expect(url.toString()).toMatch(
        /^https:\/\/developer\.(download\.)?nvidia\.com.+\.exe$/
      )
    }
  } finally {
    x86Spy.mockRestore()
  }
})

test('Network Windows links should start with https://developer.(download.)nvidia.com and end with network.exe', async () => {
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    const versions = WindowsLinks.Instance.getAvailableNetworkCudaVersions()
    const filteredVersions = versions.filter((version) => {
      return (
        version.version !== '10.0.130' &&
        version.version !== '9.2.148' &&
        version.version !== '8.0.61'
      )
    })
    for (const version of filteredVersions) {
      const url: URL =
        await WindowsLinks.Instance.getNetworkURLFromCudaVersion(version)
      expect(url.toString()).toMatch(
        /^https:\/\/developer\.(download\.)?nvidia\.com.+network\.exe$/
      )
    }
  } finally {
    x86Spy.mockRestore()
  }
})

test('Windows 13.4.2 local URLs resolve per architecture', async () => {
  const version = new SemVer('13.4.2')
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    const x86Url =
      await WindowsLinks.Instance.getLocalURLFromCudaVersion(version)
    expect(x86Url.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.2/local_installers/cuda_13.4.2_windows_x86_64.exe'
    )
  } finally {
    x86Spy.mockRestore()
  }
  const armSpy = jest.spyOn(os, 'arch').mockReturnValue('arm64')
  try {
    const armUrl =
      await WindowsLinks.Instance.getLocalURLFromCudaVersion(version)
    expect(armUrl.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.2/local_installers/cuda_13.4.2_windows_arm64.exe'
    )
  } finally {
    armSpy.mockRestore()
  }
})

test('Windows 13.4.2 network URLs resolve per architecture', async () => {
  const version = new SemVer('13.4.2')
  const x86Spy = jest.spyOn(os, 'arch').mockReturnValue('x64')
  try {
    const x86Url =
      await WindowsLinks.Instance.getNetworkURLFromCudaVersion(version)
    expect(x86Url.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.2/network_installers/cuda_13.4.2_windows_x86_64_network.exe'
    )
  } finally {
    x86Spy.mockRestore()
  }
  const armSpy = jest.spyOn(os, 'arch').mockReturnValue('arm64')
  try {
    const armUrl =
      await WindowsLinks.Instance.getNetworkURLFromCudaVersion(version)
    expect(armUrl.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.2/network_installers/cuda_13.4.2_windows_arm64_network.exe'
    )
  } finally {
    armSpy.mockRestore()
  }
})

test('Windows 13.4.1 ARM64 URLs resolve correctly', async () => {
  const armSpy = jest.spyOn(os, 'arch').mockReturnValue('arm64')
  try {
    const localUrl = await WindowsLinks.Instance.getLocalURLFromCudaVersion(
      new SemVer('13.4.1')
    )
    expect(localUrl.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.1/local_installers/cuda_13.4.1_windows_arm64.exe'
    )
    const networkUrl = await WindowsLinks.Instance.getNetworkURLFromCudaVersion(
      new SemVer('13.4.1')
    )
    expect(networkUrl.toString()).toBe(
      'https://developer.download.nvidia.com/compute/cuda/13.4.1/network_installers/cuda_13.4.1_windows_arm64_network.exe'
    )
  } finally {
    armSpy.mockRestore()
  }
})

test('Windows ARM64 throws for versions before 13.4.1', async () => {
  const armSpy = jest.spyOn(os, 'arch').mockReturnValue('arm64')
  try {
    await expect(
      WindowsLinks.Instance.getLocalURLFromCudaVersion(new SemVer('13.3.1'))
    ).rejects.toThrow('not available for Windows ARM64')
    await expect(
      WindowsLinks.Instance.getNetworkURLFromCudaVersion(new SemVer('13.3.1'))
    ).rejects.toThrow('not available for Windows ARM64')
    // 12.9.2 network URL contains an x86_64 marker but has no ARM64 build
    await expect(
      WindowsLinks.Instance.getNetworkURLFromCudaVersion(new SemVer('12.9.2'))
    ).rejects.toThrow('not available for Windows ARM64')
  } finally {
    armSpy.mockRestore()
  }
})
