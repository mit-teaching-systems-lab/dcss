function MockRecorder() {}

MockRecorder.prototype.start = jest.fn(async () => {});
MockRecorder.prototype.stop = function() {
  return this;
};
MockRecorder.prototype.getMp3 = async function() {
  return [new Uint8Array(2), new Blob()];
};

if (window) {
  window.MediaRecorder = function() {};
  window.MediaRecorder.prototype.start = jest.fn();
  window.MediaRecorder.prototype.stop = jest.fn();
}

export default MockRecorder;
