import React from "react";

import { Modal } from "react-responsive-modal";
import useInputState from "../../hooks/useInputState";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { addSitemap, scrapData } from "./../../utils/routes";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

export default function Form(props) {
  const [title, handleTitleChange, rT] = useInputState("");
  const [link, handleLinkChange, rL] = useInputState("");
  const [algo, handleAlgoChange, rA] = useInputState("");

  // useEffect(() => {
  //   const addData = async () => {
  //     try {
  //       let body = { title, link, algo };
  //       console.log(body);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   addData();
  // }, []);
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = { link, title, algo };
    try {
      axios.post(addSitemap, body);
      axios.post(scrapData, { url: link });
      props.toggleModal(false);
      rA();
      rL();
      rT();
      toast.success("Sitemap Added");
      history.push("/home");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      open={props.modalIsOpen}
      onClose={() => props.toggleModal(false)}
      center
    >
      <div className="container">
        <div
          className="col mx-auto"
          style={{ color: "rgba(12, 213, 8, 0.952)" }}
        >
          <h4>
            <strong>Add Sitemap</strong>
          </h4>
        </div>
        <form>
          <div className="">
            <div className="col-lg-12 mb-4">
              <label style={{ color: "rgb(66, 63, 63)" }}>
                <strong>Title</strong>
              </label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="col-lg-12 mb-4">
              <label style={{ color: "rgb(66, 63, 63)" }}>
                <strong>Sitemap</strong>
              </label>
              <input
                type="text"
                className="form-control"
                value={link}
                onChange={handleLinkChange}
              />
            </div>
            <div className="col-lg-12 mb-4">
              <label style={{ color: "rgb(66, 63, 63)" }}>
                <strong>Algorithm</strong>
              </label>
              <div className="row">
                <div className="col-lg-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="1"
                      onChange={handleAlgoChange}
                    />
                    <label className="form-check-label">1</label>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="2"
                      onChange={handleAlgoChange}
                    />
                    <label className="form-check-label">2</label>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="3"
                      onChange={handleAlgoChange}
                    />
                    <label className="form-check-label">3</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 mb-2">
              <button
                type="button"
                className={`btn btn-secondary btn-lg btn-block `}
                onClick={handleSubmit}
              >
                <strong style={{ fontSize: "17px" }}>Add</strong>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
